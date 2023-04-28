async function getTarjetas(matricula) {
  let response;
  try {
    response = await fetch(
      `https://www.aag.org.ar/cake/Usuarios/getTarjetas/${matricula}`,
    );
  } catch (err) {
    console.log(err);
  }
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
    const date = new Date(tarjeta.FechaTorneo);
    const cargaDate = new Date(tarjeta.FechaCarga);
    date.setHours(7);
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
