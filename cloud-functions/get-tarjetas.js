const fetch = require('node-fetch');
const cheerio = require('cheerio');

const baseUrl = 'https://www.aag.org.ar/cake/Usuarios/getTarjetas';

const getTarjetas = async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    if (req.method === 'OPTIONS') {
      res.set('Access-Control-Allow-Methods', 'GET');
      res.set('Access-Control-Allow-Headers', 'Content-Type');
      res.set('Access-Control-Max-Age', '3600');
      res.status(204).send('');
      return;
    }
  const matricula = req.query.matricula.trim();
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
    selected: bestEight.some((candTarjeta) => candTarjeta.id === tarjeta.id)
  }));
  res.send(tarjetas);
};

module.exports = getTarjetas;
