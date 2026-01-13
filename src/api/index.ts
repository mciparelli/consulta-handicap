import { date } from "~/utils";
import * as aag from "./aag";
import { handicap, jugadores } from "./hyperdrive-db";
import * as vista from "./vista";
import type { Player, Tarjeta } from "~/types";
import type { DbContext } from "~/db/libsql-client";

async function saveHistorico(playersInfo: Player[], context: DbContext): Promise<void> {
  try {
    await jugadores.upsertMany(
      playersInfo.map(({ matricula, clubName, fullName }) => ({
        matricula,
        clubName,
        fullName,
      })),
      context
    );
    await handicap.upsertMany(
      playersInfo.map(({ matricula, handicapIndex, handicapDate }) => ({
        matricula: String(matricula),
        handicapIndex,
        date: handicapDate,
      })),
      context
    );
  } catch (error) {
    console.error("Error saving historico:", error);
  }
}

export async function findPlayers(
  searchString: string | null,
  context: DbContext
): Promise<Player[] | null> {
  if (!searchString || searchString.length < 3) return null;
  const playersInfo = await vista.findPlayers(searchString);
  // save but no need to wait on response
  saveHistorico(playersInfo, context);
  return playersInfo;
}

interface TarjetaWithSelected extends Tarjeta {
  selected: boolean;
}

function getSelectedIds(tarjetas: Tarjeta[]): string[] {
  const all9Holes = tarjetas
    .filter((tarjeta) => tarjeta.is9Holes)
    .sort((a, b) => a.diferencial - b.diferencial);

  interface Combined9Holes {
    ids: Tarjeta[];
    is9: boolean;
    diferencial: number;
  }

  let selected9Holes: Combined9Holes[] = [];
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
    .flatMap((t) => ("is9" in t && t.is9 ? t.ids.map((x) => x.id) : (t as Tarjeta).id))
    .slice(0, 8);
}

export async function getTarjetas(
  matricula: number,
  todas: boolean
): Promise<TarjetaWithSelected[]> {
  const allTarjetas = await aag.getTarjetas(matricula);

  const processed: Tarjeta[] = [];
  const unprocessed: Tarjeta[] = [];

  for (const tarjeta of allTarjetas) {
    if (tarjeta.processed) {
      processed.push(tarjeta);
    } else {
      unprocessed.push(tarjeta);
    }
  }

  // don't care about older ones
  const last20Tarjetas = processed.slice(0, 20);
  const selectedIds = getSelectedIds(last20Tarjetas);

  const toReturn: TarjetaWithSelected[] = [...unprocessed, ...last20Tarjetas].map((tarjeta) => ({
    ...tarjeta,
    selected: selectedIds.includes(tarjeta.id),
  }));

  if (!todas) return toReturn;

  const historicas = processed.slice(20).map((tarjeta) => ({
    ...tarjeta,
    historica: true,
    selected: false,
  }));

  return [...toReturn, ...historicas];
}

export const getHistorico = (matricula: number, monthsBack: number, context: DbContext) =>
  handicap.getHistorico(matricula, monthsBack, context);

export async function getPlayer(matricula: number, context: DbContext): Promise<Player | null> {
  const dbPlayer = await jugadores.findWithLatestHandicap(matricula, context);

  if (dbPlayer) {
    const now = new Date();
    const playerDate = date.make7Am(new Date(dbPlayer.handicapDate));
    const msDiff = now.getTime() - playerDate.getTime();
    const daysDiff = Math.floor(msDiff / (1000 * 60 * 60 * 24));
    const timeToUpdate = daysDiff >= 7;
    if (!timeToUpdate) return dbPlayer;
  }

  const players = await findPlayers(String(matricula), context);
  return players?.[0] ?? null;
}

export { createSchema } from "./hyperdrive-db";
