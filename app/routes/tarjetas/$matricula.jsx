import { useLoaderData, useParams } from "remix";
import invariant from "tiny-invariant";
import React, { useMemo, useState } from "react";
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
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import { useTheme } from "@mui/material/styles";
import { findPlayersFromVista, getTarjetas } from "~/api";
import { daysToSeconds, hexToRGB } from "~/utils";

export async function loader({ params: { matricula }, request }) {
  invariant(matricula, "expected matricula");
  const url = new URL(request.url);
  let playerInfo = Object.fromEntries(url.searchParams);
  const { fullName, club, handicapIndex } = playerInfo;
  const hasParams = Boolean(fullName && club && handicapIndex);
  const tarjetas = await getTarjetas(matricula);
  if (!hasParams) {
    [playerInfo] = await findPlayersFromVista(matricula);
  }
  return { tarjetas, playerInfo };
}

export function headers() {
  return {
    "Cache-Control": `max-age=${daysToSeconds(1)}, s-maxage=${daysToSeconds(
      1
    )}, stale-while-revalidate=${daysToSeconds(6)}`,
  };
}

export default function Tarjetas() {
  const { matricula } = useParams();
  const {
    tarjetas,
    playerInfo: { fullName, club, handicapIndex },
  } = useLoaderData();
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
          case "score": {
            value = a.score - b.score;
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
          case "pcc": {
            value = a.PCC - b.PCC;
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
    [tarjetas, orderBy, ascSort]
  );
  if (sortedTarjetas.length === 0)
    return (
      <Box m="auto">
        <Typography>No se encontraron tarjetas para este jugador</Typography>
      </Box>
    );
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" component="p" sx={{ py: 2, display: "flex" }}>
        <Box component="span" sx={{ display: { xs: "none", sm: "flex" } }}>
          {fullName} ({club}).{" "}
        </Box>
        Matrícula {matricula}.{" "}
        <Box sx={{ ml: "auto", textAlign: "right" }} component="span">
          Hándicap Index: {handicapIndex}
          {/*nextHandicapIndex && (
              <Box>
                Hándicap Index proyectado:{' '}
                <Tooltip title="Puede cambiar si ingresan nuevas tarjetas antes del jueves próximo">
                  <span>{nextHandicapIndex}</span>
                </Tooltip>
              </Box>
            )*/}
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
        ></Box>
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
        ></Box>
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
                  active={orderBy === "score"}
                  direction={orderBy === "score" ? sortDirection : undefined}
                  onClick={(_ev) => sortBy("score")}
                >
                  Score
                </TableSortLabel>
              </TableCell>
              <Hidden smDown>
                <TableCell align="center">
                  <TableSortLabel
                    active={orderBy === "calificacion"}
                    direction={
                      orderBy === "calificacion" ? sortDirection : undefined
                    }
                    onClick={(_ev) => sortBy("calificacion")}
                  >
                    Calificación
                  </TableSortLabel>
                </TableCell>
                <TableCell align="center">
                  <TableSortLabel
                    active={orderBy === "slope"}
                    direction={orderBy === "slope" ? sortDirection : undefined}
                    onClick={(_ev) => sortBy("slope")}
                  >
                    Slope
                  </TableSortLabel>
                </TableCell>
                <TableCell align="center">
                  <TableSortLabel
                    active={orderBy === "pcc"}
                    direction={orderBy === "pcc" ? sortDirection : undefined}
                    onClick={(_ev) => sortBy("pcc")}
                  >
                    PCC
                  </TableSortLabel>
                </TableCell>
                <TableCell align="center">
                  <TableSortLabel
                    active={orderBy === "score-adj"}
                    direction={
                      orderBy === "score-adj" ? sortDirection : undefined
                    }
                    onClick={(_ev) => sortBy("score-adj")}
                  >
                    Score Ajustado
                  </TableSortLabel>
                </TableCell>
              </Hidden>
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
                  <TableCell align="center">{tarjeta.score}</TableCell>
                  <Hidden smDown>
                    <TableCell align="center">{tarjeta.courseRating}</TableCell>
                    <TableCell align="center">{tarjeta.slopeRating}</TableCell>
                    <TableCell align="center">{tarjeta.PCC}</TableCell>
                    <TableCell align="center">
                      {tarjeta.adjustedScore}
                    </TableCell>
                  </Hidden>
                  <TableCell align="center">
                    {tarjeta.diferencial.toFixed(1)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export function unstable_shouldReload() {
  // only reload on full page change
  return false;
}
