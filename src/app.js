import React, { useEffect, useState, Suspense } from 'react';
import useSwr from 'swr';
import {
  Box,
  Grid,
  TextField,
  AppBar,
  Toolbar,
  Typography,
  CircularProgress,
  LinearProgress,
  Tooltip,
  useMediaQuery,
} from '@material-ui/core';
import { useTheme, makeStyles } from '@material-ui/core/styles';
import { Autocomplete } from '@material-ui/lab';
import { useDebounce } from 'use-debounce';
import { getPlayers } from './api';
import Tarjetas from './tarjetas';

function App() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [textValue, setTextValue] = useState('');
  const [debouncedText] = useDebounce(textValue, 250);
  const { data: options } = useSwr(debouncedText && getPlayers(debouncedText));
  const loading = Boolean(debouncedText && !options);

  return (
    <>
      <AppBar position="static">
        <Box py={2} clone>
          <Toolbar>
            <Box
              width="100%"
              display="flex"
              flexDirection={isMobile ? 'column' : 'row'}
              alignItems="center"
              justifyContent="space-between"
            >
              <Box py={1}>
                <Typography variant="h5">Consulta de Hándicap</Typography>
              </Box>
              <Box bgcolor="white">
                {({ className }) => (
                  <Box width={isMobile ? '100%' : 450} clone>
                    <Autocomplete
                      handleHomeEndKeys={false}
                      classes={{ inputRoot: className }}
                      id="get-players"
                      noOptionsText={
                        debouncedText
                          ? 'No se encontraron jugadores'
                          : 'Ingrese matrícula o apellido'
                      }
                      loadingText="Buscando jugadores..."
                      open={open}
                      onOpen={() => {
                        setOpen(true);
                      }}
                      openText="Ver jugadores"
                      popupIcon={null}
                      onClose={() => {
                        setOpen(false);
                      }}
                      getOptionSelected={(option, value) =>
                        option.matricula === value.matricula
                      }
                      getOptionLabel={({ fullName }) => fullName}
                      filterOptions={(options) => options}
                      renderOption={({ fullName, club, handicapIndex }) => {
                        return (
                          <Tooltip
                            title={
                              <Typography component="div">
                                <div>Hándicap: {handicapIndex}</div>
                                <div>Club: {club}</div>
                              </Typography>
                            }
                          >
                            <Typography noWrap>
                              {fullName} ({handicapIndex})
                            </Typography>
                          </Tooltip>
                        );
                      }}
                      options={options || []}
                      loading={loading}
                      value={selected}
                      clearOnBlur={false}
                      onChange={(event, newValue) => {
                        setSelected(newValue);
                      }}
                      inputValue={textValue}
                      onInputChange={(ev, newInputValue) =>
                        setTextValue(newInputValue)
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Matrícula o apellido"
                          variant="outlined"
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <React.Fragment>
                                {loading ? (
                                  <CircularProgress color="inherit" size={20} />
                                ) : null}
                                {params.InputProps.endAdornment}
                              </React.Fragment>
                            ),
                          }}
                        />
                      )}
                    />
                  </Box>
                )}
              </Box>
            </Box>
          </Toolbar>
        </Box>
      </AppBar>
      {selected ? (
        <Suspense
          fallback={
            <Box m="auto" p={2} textAlign="center">
              <Typography variant="h4">
                Cargando tarjetas de {selected.fullName}
              </Typography>
              <Box py={2}>
                <LinearProgress />
              </Box>
            </Box>
          }
        >
          <Tarjetas jugador={selected} />
        </Suspense>
      ) : (
        <Box m="auto" p={2} textAlign="center">
          <Typography variant="h4">
            Elija un jugador para consultar sus últimas 20 tarjetas.
          </Typography>
        </Box>
      )}
    </>
  );
}

export default App;
