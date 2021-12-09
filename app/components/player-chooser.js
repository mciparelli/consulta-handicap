import React, { useState } from "react";
import {
  Box,
  Autocomplete,
  TextField,
  Typography,
  CircularProgress,
  Tooltip,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useDebouncedCallback } from "use-debounce";
import { Form, Link, useSearchParams } from "remix";

export default function PlayerChooser({ loading, players }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchString = searchParams.get("searchString");
  const [inputValue, setInputValue] = useState(searchString ?? "");
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const onInputChange = useDebouncedCallback((ev) => {
    setSearchParams({ searchString: ev.target.value }, { replace: true });
  }, 250);

  let options = [];

  if (players && !loading) {
    options = players;
  }

  return (
    <Box sx={{ width: { xs: "100%", sm: 450 } }} clone>
      <Form onChange={onInputChange}>
        <Autocomplete
          sx={{
            "& .MuiAutocomplete-inputRoot": { backgroundColor: "common.white" },
          }}
          id="get-players"
          noOptionsText={
            players?.length === 0
              ? "No se encontraron jugadores"
              : "Ingrese matrícula o apellido"
          }
          loadingText="Buscando jugadores..."
          open={open}
          onOpen={() => {
            setOpen(true);
          }}
          openText="Ver jugadores"
          popupIcon={null}
          onClose={() => setOpen(false)}
          getOptionLabel={({ fullName }) => fullName}
          filterOptions={(options) => options}
          renderOption={(
            props,
            { matricula, fullName, club, handicapIndex }
          ) => {
            return (
              <Tooltip
                key={matricula}
                title={
                  <Typography component="div">
                    <div>Hándicap: {handicapIndex}</div>
                    <div>Club: {club}</div>
                  </Typography>
                }
                {...props}
              >
                <Link
                  reloadDocument
                  to={`/tarjetas/${matricula}`}
                  onClick={(ev) => {
                    ev.stopPropagation();
                    setOpen(false);
                  }}
                >
                  <Typography noWrap>
                    {fullName} ({handicapIndex})
                  </Typography>
                </Link>
              </Tooltip>
            );
          }}
          options={options}
          loading={loading}
          clearOnBlur={false}
          inputValue={inputValue}
          onInputChange={(_ev, newValue) => setInputValue(newValue)}
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
      </Form>
    </Box>
  );
}
