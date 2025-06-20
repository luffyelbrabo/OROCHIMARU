const axios = require('axios');
const cheerio = require('cheerio');

async function getLetraScraping(nome) {
  try {
    const query = encodeURIComponent(nome);
    const { data } = await axios.get(`https://www.vagalume.com.br/search.php?q=${query}`);
    const $ = cheerio.load(data);

    const primeiraUrl = $('.lyrics .art a').attr('href');
    if (!primeiraUrl) return null;

    const { data: letraPage } = await axios.get(`https://www.vagalume.com.br${primeiraUrl}`);
    const $$ = cheerio.load(letraPage);

    const titulo = $$('h1').text().trim();
    const letra = $$('#lyrics p').text().trim();

    if (!letra) return null;

    return `🎵 *${titulo}*\n\n${letra}`;
  } catch {
    return null;
  }
}

module.exports = { getLetraScraping };