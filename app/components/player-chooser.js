import React from "react";
import {
  Autocomplete,
  Box,
  CircularProgress,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useDebouncedCallback } from "use-debounce";
import { Form, Link, useLoaderData, useTransition, useSubmit, useNavigate } from "@remix-run/react";

export default function PlayerChooser() {
  const navigate = useNavigate();
  const submit = useSubmit();
  const players = useLoaderData();
  const transition = useTransition();
  const loading = transition.state === "submitting";

  const onChange = useDebouncedCallback((ev) => {
    if (ev.target.value.length < 3) return
    submit(ev.target.form)
  }, 250);

  return (
    <Box sx={{ width: { xs: "100%", sm: 450 } }} clone>
      <Form method="get" action="?" onChange={onChange}>
        <Autocomplete
          sx={{
            "& .MuiAutocomplete-inputRoot": { backgroundColor: "common.white" },
          }}
          id="get-players"
          noOptionsText={players?.length === 0
            ? "No se encontraron jugadores"
            : "Ingrese matrícula o apellido"}
          loadingText="Buscando jugadores..."
          openText="Ver jugadores"
          popupIcon={null}
          getOptionLabel={({ fullName }) => fullName}
          filterOptions={(options) => options}
          onChange={(ev, player) => {
            if (player) {
              navigate(`/tarjetas/${player.matricula}`)
            }
          }}
          renderOption={(
            props,
            { matricula, fullName, club, handicapIndex },
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
                <Typography noWrap>
                  {fullName} ({handicapIndex})
                </Typography>
              </Tooltip>
            );
          }}
          options={players ?? []}
          loading={loading}
          clearOnBlur={false}
          renderInput={(params) => (
            <TextField
              {...params}
              name="searchString"
              placeholder="Matrícula o apellido"
              variant="outlined"
              inputProps={{
                ...params.inputProps,
                pattern: ".{3,}",
                required: true,
                title:"Dos o más caracteres"
              }}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <React.Fragment>
                    {loading
                      ? <CircularProgress color="inherit" size={20} />
                      : null}
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
