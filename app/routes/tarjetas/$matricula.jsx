import { json, useLoaderData, useParams } from "remix";
import invariant from "tiny-invariant";
import React, { useMemo, useState } from "react";
import {
  Box,
  Hidden,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Tooltip,
  Typography,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import { useTheme } from "@mui/material/styles";
import { findPlayersFromVista, getHistorico, getTarjetas } from "~/api";
import { hexToRGB } from "~/utils";
import Chart from "~/components/chart";

export async function loader({ params: { matricula } }) {
  invariant(matricula, "expected matricula");
  const tarjetas = await getTarjetas(matricula);
  const historico = await getHistorico(matricula);
  const [{ fullName, club, handicapIndex }] = await findPlayersFromVista(
    matricula,
  );
  return json({ tarjetas, fullName, club, handicapIndex, historico });
}

export default function Tarjetas() {
  const hideMobileStyles = { display: { sm: "none", md: "table-cell" } };
  const { matricula } = useParams();
  const { tarjetas, fullName, club, handicapIndex, historico } =
    useLoaderData();
  const theme = useTheme();
  const [orderBy, setOrderBy] = useState("fecha");
  const [ascSort, setAscSort] = useState(false);
  const sortDirection = ascSort ? "asc" : "desc";
  const sortBy = (newOrderBy) => {
    setOrderBy(newOrderBy);
    setAscSort(newOrderBy === orderBy ? !ascSort : true);
  };
  const sortedTarjetas = useMemo(
    () =>
      tarjetas.sort((a, b) => {
        let value;
        switch (orderBy) {
          case "fecha": {
            value = new Date(a.isoDate) - new Date(b.isoDate);
            break;
          }
          case "club": {
            value = a.clubName.localeCompare(b.clubName);
            break;
          }
          case "calificacion": {
            value = a.courseRating - b.courseRating;
            break;
          }
          case "slope": {
            value = a.slopeRating - b.slopeRating;
            break;
          }
          case "score-adj": {
            value = a.adjustedScore - b.adjustedScore;
            break;
          }
          case "dif": {
            value = a.diferencial - b.diferencial;
            break;
          }
        }
        return ascSort ? value : value * -1;
      }),
    [tarjetas, orderBy, ascSort],
  );
  if (sortedTarjetas.length === 0) {
    return (
      <Box m="auto">
        <Typography>No se encontraron tarjetas para este jugador</Typography>
      </Box>
    );
  }
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" component="p" sx={{ py: 2, display: "flex" }}>
        <Box
          component="span"
          sx={{ mr: 1, display: { xs: "none", sm: "flex" } }}
        >
          {fullName} ({club}).{" "}
        </Box>
        Matrícula {matricula}.{" "}
        <Box sx={{ ml: "auto", textAlign: "right" }} component="span">
          Hándicap Index: {handicapIndex}
          {
            /*nextHandicapIndex && (
              <Box>
                Hándicap Index proyectado:{' '}
                <Tooltip title="Puede cambiar si ingresan nuevas tarjetas antes del jueves próximo">
                  <span>{nextHandicapIndex}</span>
                </Tooltip>
              </Box>
            )*/
          }
        </Box>
      </Typography>
      <Box sx={{ display: "flex", py: 2 }}>
        <Box
          sx={{
            mr: 1,
            borderRadius: 1,
            width: 40,
            height: 20,
            bgcolor: theme.palette.success.light,
          }}
        >
        </Box>
        <Typography>Ocho mejores</Typography>
        <Box
          sx={{
            ml: 2,
            mr: 1,
            borderRadius: 1,
            width: 40,
            height: 20,
            bgcolor: hexToRGB(theme.palette.warning.light, 0.2),
          }}
        >
        </Box>
        <Typography>Ingresan el próximo jueves</Typography>
      </Box>
      <TableContainer sx={{ flexGrow: 1 }} component={Paper}>
        <Table stickyHeader aria-label="tarjetas del jugador">
          <TableHead>
            <TableRow>
              <TableCell align="left">
                <TableSortLabel
                  active={orderBy === "fecha"}
                  direction={orderBy === "fecha" ? sortDirection : undefined}
                  onClick={(_ev) => sortBy("fecha")}
                >
                  Fecha
                </TableSortLabel>
              </TableCell>
              <TableCell align="left">
                <TableSortLabel
                  active={orderBy === "club"}
                  direction={orderBy === "club" ? sortDirection : undefined}
                  onClick={(_ev) => sortBy("club")}
                >
                  Club
                </TableSortLabel>
              </TableCell>
              <TableCell align="center">
                <TableSortLabel
                  active={orderBy === "score-adj"}
                  direction={orderBy === "score-adj"
                    ? sortDirection
                    : undefined}
                  onClick={(_ev) => sortBy("score-adj")}
                >
                  Score (ajustado)
                </TableSortLabel>
              </TableCell>
              <TableCell align="center" sx={hideMobileStyles}>
                <TableSortLabel
                  active={orderBy === "calificacion"}
                  direction={orderBy === "calificacion"
                    ? sortDirection
                    : undefined}
                  onClick={(_ev) => sortBy("calificacion")}
                >
                  Calificación
                </TableSortLabel>
              </TableCell>
              <TableCell align="center" sx={hideMobileStyles}>
                <TableSortLabel
                  active={orderBy === "slope"}
                  direction={orderBy === "slope" ? sortDirection : undefined}
                  onClick={(_ev) => sortBy("slope")}
                >
                  Slope
                </TableSortLabel>
              </TableCell>
              <TableCell align="center">
                <Tooltip title="(113 / Slope) x (Score Ajustado – Calificación - PCC)">
                  <TableSortLabel
                    active={orderBy === "dif"}
                    direction={orderBy === "dif" ? sortDirection : undefined}
                    onClick={(_ev) => sortBy("dif")}
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
            {sortedTarjetas.map((tarjeta) => {
              let backgroundColor;
              if (!tarjeta.processed) {
                backgroundColor = hexToRGB(theme.palette.warning.light, 0.2);
              } else if (tarjeta.selected) {
                backgroundColor = theme.palette.success.light;
              }
              return (
                <TableRow
                  sx={{
                    backgroundColor,
                  }}
                  key={tarjeta.id}
                >
                  <TableCell align="left">{tarjeta.formattedDate}</TableCell>
                  <TableCell align="left">{tarjeta.clubName.trim()}</TableCell>
                  <TableCell align="center">
                    {tarjeta.score}
                    {tarjeta.adjustedScore !== tarjeta.score &&
                      ` (${tarjeta.adjustedScore})`}
                    {tarjeta.PCC > 0 ? ` PCC ${tarjeta.PCC}` : ""}
                  </TableCell>
                  <TableCell sx={hideMobileStyles} align="center">
                    {tarjeta.courseRating}
                  </TableCell>
                  <TableCell sx={hideMobileStyles} align="center">
                    {tarjeta.slopeRating}
                  </TableCell>
                  <TableCell align="center">
                    {tarjeta.diferencial.toFixed(1)}
                    {tarjeta.is9Holes ? "*" : undefined}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <Chart
        data={historico.map(({ handicapIndex: y, dateMs: x }) => ({ x, y }))}
      />
    </Box>
  );
}

export function ErrorBoundary({ error }) {
  return (
    <Box sx={{ m: "auto", p: 2, textAlign: "center" }}>
      <Typography variant="h4">
        Hubo un error al buscar las tarjetas de este jugador. Intente más tarde.
      </Typography>
    </Box>
  );
}

export function unstable_shouldReload() {
  // only reload on full page change
  return false;
}
