const fetch = require('node-fetch');
const cheerio = require('cheerio');

const findPlayersFromVista = async (searchString) => {
  const url = 'http://www.vistagolf.com.ar/handicap/FiltroArg.asp';

  const isOnlyNumbers = /^\d+$/.test(searchString);
  const params = new URLSearchParams();
  const paramKey = isOnlyNumbers ? 'TxtNroMatricula' : 'TxtApellido';
  params.append(paramKey, searchString);
  const response = await fetch(url, { method: 'POST', body: params });
  const result = await response.textConverted();
  const $ = cheerio.load(result);
  const players = $('#table19 tr')
    .slice(2)
    .map((index, element) => {
      const [matricula, fullName, handicapIndex, club] = $('td', element)
        .map((index, el) => $(el).text().trim())
        .get();
      return { matricula, fullName, handicapIndex, club };
    })
    .get();
  return players;
};

const findPlayersFromDigitalGolf = async (searchString) => {
  try {
    const url = 'https://ar.digitalgolftour.com/search-golfers';

    const params = new URLSearchParams();
    params.append('startRow', 0);
    params.append('endRow', 25);
    params.append('subdomain', 'ar');
    params.append('filterBy', searchString);
    const response = await fetch(url, { method: 'POST', body: params });
    const { Result: results } = await response.json();
    const players = results.map((golfista) => {
      return {
        profileUrl: golfista.ProfileUrl,
        fullName: golfista.Name,
        handicapIndex: golfista.HandicapIndex,
        club: golfista.ClubName,
      };
    });
    return players;
  } catch (_err) {
    return []; // just return empty if errors out (sometimes returns HTML so JSON fails to parse)
  }
};

const allowCors = (fn) => async (req, res) => {
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

const getPlayers = async (req, res) => {
  const { searchString } = req.query;
  const trimmedString = searchString.trim();
  let players = await findPlayersFromVista(trimmedString);
  // sometimes players are just not found in vista
  if (players.length === 0) {
    players = await findPlayersFromDigitalGolf(trimmedString);
  }
  res.json(players);
};

module.exports = allowCors(getPlayers);
