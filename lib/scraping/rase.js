const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const cachePath = path.join(__dirname, '../cache/rase_cache.json');

async function getRaseVariations() {
  if (fs.existsSync(cachePath)) {
    const cache = JSON.parse(fs.readFileSync(cachePath));
    // Cache válido por 10 minutos
    if (Date.now() - cache.timestamp < 10 * 60 * 1000) {
      return cache.data;
    }
  }

  try {
    const url = 'https://cmrewards.net';  // Ajuste para o site correto caso mude
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    let raseVariations = new Set();

    // Exemplo genérico de seletor, ajuste conforme o HTML real do site
    $('.rase-sequencia-selector').each((i, el) => {
      raseVariations.add($(el).text().trim());
    });

    const result = [...raseVariations];
    fs.writeFileSync(cachePath, JSON.stringify({ timestamp: Date.now(), data: result }, null, 2));
    return result;
  } catch (e) {
    console.error('Erro no scraping de Rase:', e.message);
    return ['❌ Erro ao obter sequência Rase'];
  }
}

module.exports = { getRaseVariations };