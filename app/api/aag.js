import cache from "~/cache";
import { daysToSeconds } from "~/utils";

const baseUrl = "https://www.aag.org.ar/cake/Usuarios/getTarjetas";

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
  let tarjetas18Holes = tarjetas.filter((tarjeta) => !tarjeta.is9Holes);
  const tarjetasToConsider = [...selected9Holes, ...tarjetas18Holes];
  return tarjetasToConsider
    .sort((a, b) => a.diferencial - b.diferencial)
    .map((t) => (t.is9 ? t.ids : t.id))
    .flat()
    .slice(0, 8);
}

async function getTarjetas(matricula) {
  const cacheKey = `hcp:tarjetas:${matricula}`;
  const cacheValue = await cache.json.get(cacheKey);
  if (cacheValue) return cacheValue;
  const response = await fetch(`${baseUrl}/${matricula}`);
  const result = await response.json();

  const allTarjetas = result.map((tarjeta) => {
    const [clubId, clubName] = tarjeta.NombreClub.split(" - ");
    const slopeRating = tarjeta.SlopeRating;
    const adjustedScore = tarjeta.ScoreAjustado;
    const courseRating = tarjeta.CourseRating;
    const PCC = tarjeta.PCC;
    const diferencial = tarjeta.Diferencial;
    const date = new Date(tarjeta.FechaTorneo);
    const formattedDate = `${date.getDate()}/${
      date.getMonth() +
      1
    }/${date.getFullYear()}`;
    const idTarjeta = `${clubId}-${formattedDate}-${diferencial}`;
    return {
      id: idTarjeta,
      isoDate: date.toISOString(),
      formattedDate,
      clubId,
      clubName,
      diferencial,
      score: tarjeta.Score,
      PCC,
      adjustedScore,
      courseRating,
      slopeRating,
      is9Holes: tarjeta.TipoTarjeta === "9",
      processed: tarjeta.Procesado,
    };
  });

  const [processed, unprocessed] = [[], []];

  for (let tarjeta of allTarjetas) {
    if (tarjeta.processed) {
      processed.push(tarjeta);
    } else {
      unprocessed.push(tarjeta);
    }
  }
  // dont care about older ones
  let last20Tarjetas = processed.slice(0, 20);
  const selectedIds = getSelectedIds(last20Tarjetas);
  last20Tarjetas = last20Tarjetas.map((tarjeta) => ({
    ...tarjeta,
    selected: selectedIds.includes(tarjeta.id),
  }));
  const tarjetas = [...unprocessed, ...last20Tarjetas];
  await cache.json.setex(cacheKey, daysToSeconds(0.4), tarjetas);
  return tarjetas;
}

export { getTarjetas };
