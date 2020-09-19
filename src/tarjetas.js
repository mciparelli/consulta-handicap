import React, { useMemo, useState } from 'react';
import useSwr from 'swr';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableSortLabel,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Hidden,
  Paper,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { getTarjetas } from './api';

const useStyles = makeStyles((theme) => ({
  tableRow: {
    '&.selected': {
      backgroundColor: theme.palette.success.light,
    },
  },
}));

const Tarjetas = ({
  jugador: { fullName, club, matricula, handicapIndex },
}) => {
  const styles = useStyles();
  const { data: tarjetas } = useSwr(getTarjetas(matricula), {
    suspense: true,
  });
  const [orderBy, setOrderBy] = useState('fecha');
  const [ascSort, setAscSort] = useState(false);
  const sortDirection = ascSort ? 'asc' : 'desc';
  const sortBy = (newOrderBy) => {
    setOrderBy(newOrderBy);
    setAscSort(newOrderBy === orderBy ? !ascSort : true);
  };
  const sortedTarjetas = useMemo(
    () =>
      tarjetas.slice(0).sort((a, b) => {
        let value;
        switch (orderBy) {
          case 'fecha': {
            value = new Date(a.FechaTorneo) - new Date(b.FechaTorneo);
            break;
          }
          case 'club': {
            value = a.NombreClub.localeCompare(b.NombreClub);
            break;
          }
          case 'score': {
            value = a.Score - b.Score;
            break;
          }
          case 'esr': {
            value = a.ESR - b.ESR;
            break;
          }
          case 'calificacion': {
            value = a.CourseRating - b.CourseRating;
            break;
          }
          case 'slope': {
            value = a.SlopeRating - b.SlopeRating;
            break;
          }
          case 'pcc': {
            value = a.PCC - b.PCC;
            break;
          }
          case 'score-adj': {
            value = a.ScoreAjustado - b.ScoreAjustado;
            break;
          }
          case 'dif': {
            value = a.Diferencial - b.Diferencial;
            break;
          }
        }
        return ascSort ? value : value * -1;
      }),
    [tarjetas, orderBy, ascSort],
  );
  if (sortedTarjetas.length === 0)
    return (
      <Box m="auto">
        <Typography>No se encontraron tarjetas para este jugador</Typography>
      </Box>
    );
  return (
    <Box p={3}>
      <Box py={2} display="flex" clone>
        <Typography variant="h5" component="p">
          <Hidden xsDown>
            {fullName} ({club}).{' '}
          </Hidden>
          Matrícula {matricula}.{' '}
          <Box ml="auto">Hándicap Index: {handicapIndex}</Box>
        </Typography>
      </Box>
      <Box flexGrow={1} clone>
        <TableContainer component={Paper}>
          <Table stickyHeader aria-label="tarjetas del jugador">
            <TableHead>
              <TableRow>
                <TableCell align="left">
                  <TableSortLabel
                    active={orderBy === 'fecha'}
                    direction={orderBy === 'fecha' ? sortDirection : undefined}
                    onClick={(_ev) => sortBy('fecha')}
                  >
                    Fecha
                  </TableSortLabel>
                </TableCell>
                <TableCell align="left">
                  <TableSortLabel
                    active={orderBy === 'club'}
                    direction={orderBy === 'club' ? sortDirection : undefined}
                    onClick={(_ev) => sortBy('club')}
                  >
                    Club
                  </TableSortLabel>
                </TableCell>
                <TableCell align="center">
                  <TableSortLabel
                    active={orderBy === 'score'}
                    direction={orderBy === 'score' ? sortDirection : undefined}
                    onClick={(_ev) => sortBy('score')}
                  >
                    Score
                  </TableSortLabel>
                </TableCell>
                <Hidden smDown>
                  <TableCell align="center">
                    <TableSortLabel
                      active={orderBy === 'esr'}
                      direction={orderBy === 'esr' ? sortDirection : undefined}
                      onClick={(_ev) => sortBy('esr')}
                    >
                      ESR
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="center">
                    <TableSortLabel
                      active={orderBy === 'calificacion'}
                      direction={
                        orderBy === 'calificacion' ? sortDirection : undefined
                      }
                      onClick={(_ev) => sortBy('calificacion')}
                    >
                      Calificación
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="center">
                    <TableSortLabel
                      active={orderBy === 'slope'}
                      direction={
                        orderBy === 'slope' ? sortDirection : undefined
                      }
                      onClick={(_ev) => sortBy('slope')}
                    >
                      Slope
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="center">
                    <TableSortLabel
                      active={orderBy === 'pcc'}
                      direction={orderBy === 'pcc' ? sortDirection : undefined}
                      onClick={(_ev) => sortBy('pcc')}
                    >
                      PCC
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="center">
                    <TableSortLabel
                      active={orderBy === 'score-adj'}
                      direction={
                        orderBy === 'score-adj' ? sortDirection : undefined
                      }
                      onClick={(_ev) => sortBy('score-adj')}
                    >
                      Score Ajustado
                    </TableSortLabel>
                  </TableCell>
                </Hidden>
                <TableCell align="center">
                  <TableSortLabel
                    active={orderBy === 'dif'}
                    direction={orderBy === 'dif' ? sortDirection : undefined}
                    onClick={(_ev) => sortBy('dif')}
                  >
                    Diferencial Ajustado
                  </TableSortLabel>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedTarjetas.map((tarjeta, index) => (
                <TableRow
                  className={`${tarjeta.Seleccionado ? 'selected' : ''} ${
                    styles.tableRow
                  }`}
                  key={index}
                >
                  <TableCell align="left">{tarjeta.FechaTorneo}</TableCell>
                  <TableCell align="left">
                    {tarjeta.NombreClub.trim()}
                  </TableCell>
                  <TableCell align="center">{tarjeta.Score}</TableCell>
                  <Hidden smDown>
                    <TableCell align="center">{tarjeta.ESR}</TableCell>
                    <TableCell align="center">{tarjeta.CourseRating}</TableCell>
                    <TableCell align="center">{tarjeta.SlopeRating}</TableCell>
                    <TableCell align="center">{tarjeta.PCC}</TableCell>
                    <TableCell align="center">
                      {tarjeta.ScoreAjustado}
                    </TableCell>
                  </Hidden>
                  <TableCell align="center">{tarjeta.Diferencial}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default Tarjetas;
