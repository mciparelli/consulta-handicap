function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import React, { useEffect, useState, Suspense } from '/web_modules/react.js';
import useSwr from '/web_modules/swr.js';
import { Box, Grid, TextField, AppBar, Toolbar, Typography, CircularProgress, LinearProgress, Tooltip, useMediaQuery } from '/web_modules/@material-ui/core.js';
import { useTheme, makeStyles } from '/web_modules/@material-ui/core/styles.js';
import { Autocomplete } from '/web_modules/@material-ui/lab.js';
import { useDebounce } from '/web_modules/use-debounce.js';
import { getPlayers } from './api.js';
import Tarjetas from './tarjetas.js';

function App() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [textValue, setTextValue] = useState('');
  const [debouncedText] = useDebounce(textValue, 250);
  const {
    data: options
  } = useSwr(debouncedText && getPlayers(debouncedText));
  const loading = Boolean(debouncedText && !options);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(AppBar, {
    position: "static"
  }, /*#__PURE__*/React.createElement(Box, {
    py: 2,
    clone: true
  }, /*#__PURE__*/React.createElement(Toolbar, null, /*#__PURE__*/React.createElement(Box, {
    width: "100%",
    display: "flex",
    flexDirection: isMobile ? 'column' : 'row',
    alignItems: "center",
    justifyContent: "space-between"
  }, /*#__PURE__*/React.createElement(Box, {
    py: 1
  }, /*#__PURE__*/React.createElement(Typography, {
    variant: "h5"
  }, "Consulta de H\xE1ndicap")), /*#__PURE__*/React.createElement(Box, {
    bgcolor: "white"
  }, ({
    className
  }) => /*#__PURE__*/React.createElement(Box, {
    width: isMobile ? '100%' : 450,
    clone: true
  }, /*#__PURE__*/React.createElement(Autocomplete, {
    handleHomeEndKeys: false,
    classes: {
      inputRoot: className
    },
    id: "get-players",
    noOptionsText: debouncedText ? 'No se encontraron jugadores' : 'Ingrese matrícula o apellido',
    loadingText: "Buscando jugadores...",
    open: open,
    onOpen: () => {
      setOpen(true);
    },
    openText: "Ver jugadores",
    popupIcon: null,
    onClose: () => {
      setOpen(false);
    },
    getOptionSelected: (option, value) => option.matricula === value.matricula,
    getOptionLabel: ({
      fullName
    }) => fullName,
    filterOptions: options => options,
    renderOption: ({
      fullName,
      matricula,
      club,
      handicapIndex
    }) => {
      return /*#__PURE__*/React.createElement(Tooltip, {
        title: /*#__PURE__*/React.createElement(Typography, {
          component: "div"
        }, /*#__PURE__*/React.createElement("div", null, "Mat. ", matricula), /*#__PURE__*/React.createElement("div", null, "H\xE1ndicap: ", handicapIndex), /*#__PURE__*/React.createElement("div", null, "Club: ", club))
      }, /*#__PURE__*/React.createElement(Typography, {
        noWrap: true
      }, fullName));
    },
    options: options ?? [],
    loading: loading,
    value: selected,
    clearOnBlur: false,
    onChange: (event, newValue) => {
      setSelected(newValue);
    },
    inputValue: textValue,
    onInputChange: (ev, newInputValue) => setTextValue(newInputValue),
    renderInput: params => /*#__PURE__*/React.createElement(TextField, _extends({}, params, {
      placeholder: "Matr\xEDcula o apellido",
      variant: "outlined",
      InputProps: { ...params.InputProps,
        endAdornment: /*#__PURE__*/React.createElement(React.Fragment, null, loading ? /*#__PURE__*/React.createElement(CircularProgress, {
          color: "inherit",
          size: 20
        }) : null, params.InputProps.endAdornment)
      }
    }))
  }))))))), /*#__PURE__*/React.createElement(Suspense, {
    fallback: /*#__PURE__*/React.createElement(Box, {
      m: "auto",
      p: 2,
      textAlign: "center"
    }, /*#__PURE__*/React.createElement(Typography, {
      variant: "h4"
    }, "Cargando tarjetas de ", selected?.fullName), /*#__PURE__*/React.createElement(Box, {
      py: 2
    }, /*#__PURE__*/React.createElement(LinearProgress, null)))
  }, selected ? /*#__PURE__*/React.createElement(Tarjetas, {
    jugador: selected
  }) : /*#__PURE__*/React.createElement(Box, {
    m: "auto",
    p: 2,
    textAlign: "center"
  }, /*#__PURE__*/React.createElement(Typography, {
    variant: "h4"
  }, "Elija un jugador para consultar sus \xFAltimas 20 tarjetas."))));
}

export default App;