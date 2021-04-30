const fetch = require('node-fetch');
const cheerio = require('cheerio');

const getMatricula = async profileUrl => {
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

  const allTarjetas = result.map(tarjeta => {
    const [clubId, clubName] = tarjeta.NombreClub.split(' - ');
    const slopeRating = tarjeta.SlopeRating;
    const adjustedScore = tarjeta.ScoreAjustado;
    const courseRating = tarjeta.CourseRating;
    const PCC = tarjeta.PCC;
    const diferencial =
      (113 / slopeRating) * (adjustedScore - courseRating - PCC);
    const diferencialPretty = tarjeta.Diferencial;
    const date = new Date(tarjeta.FechaTorneo);
    const formattedDate = `${date.getDate()}/${date.getMonth() +
      1}/${date.getFullYear()}`;
    const idTarjeta = `${clubId}-${formattedDate}-${diferencial}`;
    return {
      id: idTarjeta,
      isoDate: date.toISOString(),
      formattedDate,
      clubId,
      clubName,
      diferencial,
      diferencialPretty,
      score: tarjeta.Score,
      PCC,
      adjustedScore,
      courseRating,
      slopeRating,
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
  const bestEight = last20Tarjetas
    .sort((a, b) => {
      return a.diferencial - b.diferencial;
    })
    .slice(0, 8);
  last20Tarjetas = last20Tarjetas.map(tarjeta => ({
    ...tarjeta,
    selected: bestEight.some(candTarjeta => candTarjeta.id === tarjeta.id),
  }));
  const tarjetas = [...unprocessed, ...last20Tarjetas];
  const nextHandicapIndex =
    unprocessed.length > 0
      ? (
          tarjetas
            .slice(0, 20)
            .sort((a, b) => a.diferencial - b.diferencial)
            .slice(0, 8)
            .reduce((acc, tarjeta) => tarjeta.diferencial + acc, 0) / 8
        ).toFixed(1)
      : null;
  res.json({ tarjetas, nextHandicapIndex, matricula });
};

const allowCors = fn => async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  // another common pattern
  // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET,OPTIONS,PATCH,DELETE,POST,PUT',
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
  );
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  return await fn(req, res);
};

module.exports = allowCors(getTarjetas);
