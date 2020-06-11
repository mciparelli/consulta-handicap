const fetch = require('node-fetch');
const cheerio = require('cheerio');

const url = 'http://www.vistagolf.com.ar/handicap/FiltroArg.asp';

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
  const isOnlyNumbers = /^\d+$/.test(trimmedString);
  const params = new URLSearchParams();
  const paramKey = isOnlyNumbers ? 'TxtNroMatricula' : 'TxtApellido';
  params.append(paramKey, trimmedString);
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
  res.send(players);
};

module.exports = getPlayers;
