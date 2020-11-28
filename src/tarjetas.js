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
  Tooltip,
  Typography,
  Hidden,
  Paper,
} from '@material-ui/core';
import { Info as InfoIcon } from '@material-ui/icons';
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
  jugador: { fullName, club, profileUrl, matricula, handicapIndex },
}) => {
  const styles = useStyles();
  const { data } = useSwr(getTarjetas({ matricula, profileUrl }), {
    suspense: true,
  });
  const { tarjetas } = data;
  matricula = data.matricula;
  const [orderBy, setOrderBy] = useState('fecha');
  const [ascSort, setAscSort] = useState(false);
  const sortDirection = ascSort ? 'asc' : 'desc';
  const sortBy = (newOrderBy) => {
    setOrderBy(newOrderBy);
    setAscSort(newOrderBy === orderBy ? !ascSort : true);
  };
  const sortedTarjetas = useMemo(
    () =>
      tarjetas.sort((a, b) => {
        let value;
        switch (orderBy) {
          case 'fecha': {
            value = new Date(a.isoDate) - new Date(b.isoDate);
            break;
          }
          case 'club': {
            value = a.clubName.localeCompare(b.clubName);
            break;
          }
          case 'score': {
            value = a.score - b.score;
            break;
          }
          case 'esr': {
            value = a.ESR - b.ESR;
            break;
          }
          case 'calificacion': {
            value = a.courseRating - b.courseRating;
            break;
          }
          case 'slope': {
            value = a.slopeRating - b.slopeRating;
            break;
          }
          case 'pcc': {
            value = a.PCC - b.PCC;
            break;
          }
          case 'score-adj': {
            value = a.adjustedScore - b.adjustedScore;
            break;
          }
          case 'dif': {
            value = a.diferencial - b.diferencial;
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
          <Box ml="auto" component="span">
            Hándicap Index: {handicapIndex}
          </Box>
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
                  <Tooltip title="(113 / Slope) x (Score Ajustado – Calificación - PCC)">
                    <TableSortLabel
                      active={orderBy === 'dif'}
                      direction={orderBy === 'dif' ? sortDirection : undefined}
                      onClick={(_ev) => sortBy('dif')}
                    >
                      Diferencial Ajustado
                      <Box ml={1}>
                        <Typography color="textSecondary">
                          <InfoIcon />
                        </Typography>
                      </Box>
                    </TableSortLabel>
                  </Tooltip>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedTarjetas.map((tarjeta) => (
                <TableRow
                  className={`${tarjeta.selected ? 'selected' : ''} ${
                    styles.tableRow
                  }`}
                  key={tarjeta.id}
                >
                  <TableCell align="left">{tarjeta.formattedDate}</TableCell>
                  <TableCell align="left">{tarjeta.clubName.trim()}</TableCell>
                  <TableCell align="center">{tarjeta.score}</TableCell>
                  <Hidden smDown>
                    <TableCell align="center">{tarjeta.ESR}</TableCell>
                    <TableCell align="center">{tarjeta.courseRating}</TableCell>
                    <TableCell align="center">{tarjeta.slopeRating}</TableCell>
                    <TableCell align="center">{tarjeta.PCC}</TableCell>
                    <TableCell align="center">
                      {tarjeta.adjustedScore}
                    </TableCell>
                  </Hidden>
                  <TableCell align="center">{tarjeta.diferencial}</TableCell>
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
