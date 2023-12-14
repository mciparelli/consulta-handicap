import * as vista from "./vista";
import * as aag from "./aag";
import { handicap, jugadores } from "./db";
import { date } from "~/utils";

async function saveHistorico(playersInfo) {
  await jugadores.upsertMany(
    playersInfo.map(({ matricula, clubName, fullName }) => ({
      matricula,
      clubName,
      fullName,
    })),
  );
  await handicap.upsertMany(
    playersInfo.map(({ matricula, handicapIndex, handicapDate }) => ({
      matricula,
      handicapIndex,
      date: handicapDate,
    })),
  );
}

async function findPlayers(searchString) {
  if (searchString?.length < 3) return null;
  const playersInfo = await vista.findPlayers(searchString);
  saveHistorico(playersInfo); // save but no need to wait on response
  return playersInfo;
}

function getSelectedIds(tarjetas) {
  const all9Holes = tarjetas
    .filter((tarjeta) => tarjeta.is9Holes)
    .sort((a, b) => a.diferencial - b.diferencial);
  let selected9Holes = [];
  for (let i = 0; i < all9Holes.length; i += 2) {
    if (all9Holes[i + 1]) {
      selected9Holes = [
        ...selected9Holes,
        {
          ids: [all9Holes[i], all9Holes[i + 1]],
          is9: true,
          diferencial: all9Holes[i].diferencial + all9Holes[i + 1].diferencial,
        },
      ];
    }
  }
  const tarjetas18Holes = tarjetas.filter((tarjeta) => !tarjeta.is9Holes);
  const tarjetasToConsider = [...selected9Holes, ...tarjetas18Holes];
  return tarjetasToConsider
    .sort((a, b) => a.diferencial - b.diferencial)
    .map((t) => (t.is9 ? t.ids : t.id))
    .flat()
    .slice(0, 8);
}

async function getTarjetas(matricula, todas) {
  const allTarjetas = await aag.getTarjetas(matricula);

  const [processed, unprocessed] = [[], []];

  for (const tarjeta of allTarjetas) {
    if (tarjeta.processed) {
      processed.push(tarjeta);
    } else {
      unprocessed.push(tarjeta);
    }
  }
  return allTarjetas;
}

const getHistorico = handicap.getHistorico;

async function getPlayer(matricula) {
  const dbPlayer = await jugadores.findWithLatestHandicap(matricula);
  if (dbPlayer) {
    const now = new Date();
    const playerDate = date.make7Am(new Date(dbPlayer.handicapDate));
    const msDiff = now - playerDate;
    const daysDiff = Math.floor(msDiff / (1000 * 60 * 60 * 24));
    const timeToUpdate = daysDiff >= 7;
    if (!timeToUpdate) return dbPlayer;
  }
  const [player] = await findPlayers(matricula);
  return player;
}

export { findPlayers, getHistorico, getPlayer, getTarjetas, saveHistorico };
