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

const getPlayers = async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') {
    res.set('Access-Control-Allow-Methods', 'GET');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.set('Access-Control-Max-Age', '3600');
    res.status(204).send('');
    return;
  }
  const { searchString } = req.query;
  const trimmedString = searchString.trim();
  let players = await findPlayersFromVista(trimmedString);
  // sometimes players are just not found in vista
  if (players.length === 0) {
    players = await findPlayersFromDigitalGolf(trimmedString);
  }
  res.send(players);
};

module.exports = getPlayers;
