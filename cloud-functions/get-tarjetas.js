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
  res.send(result);
};

module.exports = getTarjetas;
