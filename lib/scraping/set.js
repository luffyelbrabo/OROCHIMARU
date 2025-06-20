const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const cachePath = path.join(__dirname, '../cache/set_cache.json');

async function getListaSets() {
  if (fs.existsSync(cachePath)) {
    const cache = JSON.parse(fs.readFileSync(cachePath));
    if (Date.now() - cache.timestamp < 10 * 60 * 1000) {
      return cache.data;
    }
  }

  try {
    const { data } = await axios.get('https://cmrewards.net'); // Ajuste para o site correto de sets
    const $ = cheerio.load(data);

    let sets = [];
    $('.sets-selector').each((i, el) => {
      sets.push($(el).text().trim());
    });

    fs.writeFileSync(cachePath, JSON.stringify({ timestamp: Date.now(), data: sets }, null, 2));
    return sets;
  } catch (e) {
    console.error('Erro scraping sets:', e);
    return ['❌ Erro ao obter sets'];
  }
}

module.exports = { getListaSets };