const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const cachePath = path.join(__dirname, '../cache/cartasraras_cache.json');

async function getCartasRaras() {
  if (fs.existsSync(cachePath)) {
    const cache = JSON.parse(fs.readFileSync(cachePath));
    if (Date.now() - cache.timestamp < 10 * 60 * 1000) { // 10 min cache
      return cache.data;
    }
  }

  try {
    const { data } = await axios.get('https://cmrewards.net'); // Ajuste o site que realmente lista cartas raras
    const $ = cheerio.load(data);

    // Ajuste o seletor abaixo para o que realmente pega as cartas raras
    let cartas = [];
    $('.cartas-raras-selector').each((i, el) => {
      cartas.push($(el).text().trim());
    });

    fs.writeFileSync(cachePath, JSON.stringify({ timestamp: Date.now(), data: cartas }, null, 2));
    return cartas;
  } catch (e) {
    console.error('Erro scraping cartas raras:', e);
    return ['❌ Erro ao obter cartas raras'];
  }
}

module.exports = { getCartasRaras };