import { date as dateUtils } from "~/utils";

async function getTarjetas(matricula) {
  const response = await fetch(
    `https://aag-tarjetas.onrender.com/tarjetas/${matricula}`,
  );
  const result = await response.json();

  return result.map((tarjeta) => {
    const [clubId, clubName] = tarjeta.NombreClub.split(" - ").map((v) =>
      v.trim()
    );
    const slopeRating = tarjeta.SlopeRating;
    const adjustedScore = tarjeta.ScoreAjustado;
    const courseRating = tarjeta.CourseRating;
    const PCC = tarjeta.PCC;
    const diferencial = tarjeta.Diferencial;
    const date = dateUtils.make7Am(new Date(tarjeta.FechaTorneo));
    const cargaDate = dateUtils.make7Am(new Date(tarjeta.FechaCarga));
    const id = `${clubId}-${date.getTime()}-${diferencial}`;
    return {
      id,
      date,
      cargaDate,
      clubId,
      clubName: clubName.toLowerCase().trim(),
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
}

export { getTarjetas };
