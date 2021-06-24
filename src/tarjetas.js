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
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { getTarjetas } from './api';

function hexToRGB(hex, alpha) {
  var r = parseInt(hex.slice(1, 3), 16),
    g = parseInt(hex.slice(3, 5), 16),
    b = parseInt(hex.slice(5, 7), 16);

  if (alpha) {
    return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')';
  } else {
    return 'rgb(' + r + ', ' + g + ', ' + b + ')';
  }
}

const useStyles = makeStyles((theme) => ({
  tableRow: {
    '&.unprocessed': {
      backgroundColor: hexToRGB(theme.palette.warning.light, 0.2),
    },
    '&.selected': {
      backgroundColor: theme.palette.success.light,
    },
  },
}));

const Tarjetas = ({
  jugador: { fullName, club, profileUrl, matricula, handicapIndex },
}) => {
  const theme = useTheme();
  const styles = useStyles();
  const { data } = useSwr(getTarjetas({ matricula, profileUrl }), {
    suspense: true,
  });
  const { tarjetas, nextHandicapIndex } = data;

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
          <Box ml="auto" textAlign="right">
            <Box>Hándicap Index: {handicapIndex}</Box>
            {nextHandicapIndex && (
              <Box>
                Hándicap Index proyectado:{' '}
                <Tooltip title="Puede cambiar si ingresan nuevas tarjetas antes del jueves próximo">
                  <span>{nextHandicapIndex}</span>
                </Tooltip>
              </Box>
            )}
          </Box>
        </Typography>
      </Box>
      <Box display="flex" py={2}>
        <Box
          mr={1}
          borderRadius={2}
          width={40}
          height={20}
          bgcolor={theme.palette.success.light}
        ></Box>
        <Typography>Computan para el hándicap actual</Typography>
        <Box
          ml={2}
          mr={1}
          borderRadius={2}
          width={40}
          height={20}
          bgcolor={hexToRGB(theme.palette.warning.light, 0.2)}
        ></Box>
        <Typography>Ingresan el próximo jueves</Typography>
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
                  className={`${tarjeta.processed ? '' : 'unprocessed'} ${
                    tarjeta.selected ? 'selected' : ''
                  } ${styles.tableRow}`}
                  key={tarjeta.id}
                >
                  <TableCell align="left">{tarjeta.formattedDate}</TableCell>
                  <TableCell align="left">{tarjeta.clubName.trim()}</TableCell>
                  <TableCell align="center">{tarjeta.score}</TableCell>
                  <Hidden smDown>
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
