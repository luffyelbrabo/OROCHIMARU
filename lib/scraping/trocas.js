const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const cachePath = path.join(__dirname, '../cache/trocas_cache.json');

async function getTrocas() {
  if (fs.existsSync(cachePath)) {
    const cache = JSON.parse(fs.readFileSync(cachePath));
    if (Date.now() - cache.timestamp < 10 * 60 * 1000) {
      return cache.data;
    }
  }

  try {
    const { data } = await axios.get('https://cmrewards.net'); // Ajuste para site certo
    const $ = cheerio.load(data);

    let trocas = [];
    $('.trocas-selector').each((i, el) => {
      trocas.push($(el).text().trim());
    });

    fs.writeFileSync(cachePath, JSON.stringify({ timestamp: Date.now(), data: trocas }, null, 2));
    return trocas;
  } catch (e) {
    console.error('Erro scraping trocas:', e);
    return ['❌ Erro ao obter trocas'];
  }
}

module.exports = { getTrocas };