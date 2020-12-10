const fetch = require('node-fetch');
const cheerio = require('cheerio');

const getMatricula = async (profileUrl) => {
  const res = await fetch(`https://ar.digitalgolftour.com/${profileUrl}`);

  const html = await res.text();

  const $ = cheerio.load(html);

  return Number(
    $('.player-info .row .right-col .row:nth-child(1) .col-md-4 .left-col')
      .contents()[1]
      .data.trim(),
  );
};

const baseUrl = 'https://www.aag.org.ar/cake/Usuarios/getTarjetas';

const getTarjetas = async (req, res) => {
  let { profileUrl, matricula } = req.query;
  if (!matricula) {
    matricula = await getMatricula(profileUrl);
  }
  const response = await fetch(`${baseUrl}/${matricula}`);
  const result = await response.json();
  // dont care about older ones
  const last20Tarjetas = result.slice(0, 20).map((tarjeta) => {
    const [clubId, clubName] = tarjeta.NombreClub.split(' - ');
    const diferencial = tarjeta.Diferencial;
    const date = new Date(tarjeta.FechaTorneo);
    const formattedDate = `${date.getDate()}/${
      date.getMonth() + 1
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
      adjustedScore: tarjeta.ScoreAjustado,
      ESR: tarjeta.ESR,
      PCC: tarjeta.PCC,
      courseRating: tarjeta.CourseRating,
      slopeRating: tarjeta.SlopeRating,
    };
  });
  const bestEight = last20Tarjetas
    .sort((a, b) => {
      return a.diferencial - b.diferencial;
    })
    .slice(0, 8);
  const tarjetas = last20Tarjetas.map((tarjeta) => ({
    ...tarjeta,
    selected: bestEight.some((candTarjeta) => candTarjeta.id === tarjeta.id),
  }));
  res.json({ tarjetas, matricula });
};

module.exports = getTarjetas;
