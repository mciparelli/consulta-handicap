import React from '/web_modules/react.js';
import useSwr from '/web_modules/swr.js';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Hidden, Paper } from '/web_modules/@material-ui/core.js';
import { makeStyles } from '/web_modules/@material-ui/core/styles.js';
import { getTarjetas } from './api.js';
const useStyles = makeStyles(theme => ({
  tableRow: {
    '&.selected': {
      backgroundColor: theme.palette.success.light
    }
  }
}));

const Tarjetas = ({
  jugador: {
    fullName,
    club,
    matricula,
    handicapIndex
  }
}) => {
  const styles = useStyles();
  const {
    data: tarjetas
  } = useSwr(getTarjetas(matricula), {
    suspense: true
  });
  console.log({
    tarjetas
  });
  return /*#__PURE__*/React.createElement(Box, {
    p: 3
  }, /*#__PURE__*/React.createElement(Box, {
    py: 2,
    display: "flex",
    clone: true
  }, /*#__PURE__*/React.createElement(Typography, {
    variant: "h5",
    component: "p"
  }, /*#__PURE__*/React.createElement(Hidden, {
    xsDown: true
  }, fullName, " (", club, ").", ' '), "Matr\xEDcula ", matricula, ".", ' ', /*#__PURE__*/React.createElement(Box, {
    ml: "auto"
  }, "H\xE1ndicap Index: ", handicapIndex))), /*#__PURE__*/React.createElement(Box, {
    flexGrow: 1,
    clone: true
  }, /*#__PURE__*/React.createElement(TableContainer, {
    component: Paper
  }, /*#__PURE__*/React.createElement(Table, {
    stickyHeader: true,
    "aria-label": "tarjetas del jugador"
  }, /*#__PURE__*/React.createElement(TableHead, null, /*#__PURE__*/React.createElement(TableRow, null, /*#__PURE__*/React.createElement(TableCell, {
    align: "left"
  }, "Fecha"), /*#__PURE__*/React.createElement(TableCell, {
    align: "left"
  }, "Club"), /*#__PURE__*/React.createElement(TableCell, {
    align: "center"
  }, "Score"), /*#__PURE__*/React.createElement(Hidden, {
    smDown: true
  }, /*#__PURE__*/React.createElement(TableCell, {
    align: "center"
  }, "ESR"), /*#__PURE__*/React.createElement(TableCell, {
    align: "center"
  }, "Calificaci\xF3n"), /*#__PURE__*/React.createElement(TableCell, {
    align: "center"
  }, "Slope"), /*#__PURE__*/React.createElement(TableCell, {
    align: "center"
  }, "PCC"), /*#__PURE__*/React.createElement(TableCell, {
    align: "center"
  }, "Score Ajustado")), /*#__PURE__*/React.createElement(TableCell, {
    align: "center"
  }, "Diferencial Ajustado"))), /*#__PURE__*/React.createElement(TableBody, null, tarjetas.map((tarjeta, index) => /*#__PURE__*/React.createElement(TableRow, {
    className: `${tarjeta.Seleccionado ? 'selected' : ''} ${styles.tableRow}`,
    key: index
  }, /*#__PURE__*/React.createElement(TableCell, {
    align: "left"
  }, tarjeta.DisplayDate), /*#__PURE__*/React.createElement(TableCell, {
    align: "left"
  }, tarjeta.ClubName.trim()), /*#__PURE__*/React.createElement(TableCell, {
    align: "center"
  }, tarjeta.Score), /*#__PURE__*/React.createElement(Hidden, {
    smDown: true
  }, /*#__PURE__*/React.createElement(TableCell, {
    align: "center"
  }, tarjeta.ESR), /*#__PURE__*/React.createElement(TableCell, {
    align: "center"
  }, tarjeta.CourseRating), /*#__PURE__*/React.createElement(TableCell, {
    align: "center"
  }, tarjeta.SlopeRating), /*#__PURE__*/React.createElement(TableCell, {
    align: "center"
  }, tarjeta.PCC), /*#__PURE__*/React.createElement(TableCell, {
    align: "center"
  }, tarjeta.ScoreAjustado)), /*#__PURE__*/React.createElement(TableCell, {
    align: "center"
  }, tarjeta.DisplayDiferencial))))))));
};

export default Tarjetas;