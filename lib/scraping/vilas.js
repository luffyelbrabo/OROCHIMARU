const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const cachePath = path.join(__dirname, '../cache/vilas_cache.json');

async function getValorVila(numero) {
  if (fs.existsSync(cachePath)) {
    const cache = JSON.parse(fs.readFileSync(cachePath));
    if (Date.now() - cache.timestamp < 6 * 60 * 60 * 1000) {
      const vila = cache.data.find(v => v.numero === numero);
      if (vila) return vila.valor;
    }
  }

  try {
    const { data } = await axios.get('https://ligadosgames.com/coin-master-custo-das-vilas/');
    const $ = cheerio.load(data);

    const vilas = [];

    $('table tbody tr').each((i, el) => {
      const tds = $(el).find('td');
      const num = parseInt($(tds[0]).text().trim());
      const valorStr = $(tds[1]).text().replace(/\D/g, '');
      const valor = parseInt(valorStr);

      if (!isNaN(num) && !isNaN(valor)) {
        vilas.push({ numero: num, valor });
      }
    });

    fs.writeFileSync(cachePath, JSON.stringify({ timestamp: Date.now(), data: vilas }, null, 2));

    const vila = vilas.find(v => v.numero === numero);
    return vila?.valor || null;
  } catch (e) {
    console.error('Erro ao buscar vilas:', e);
    return null;
  }
}

module.exports = { getValorVila };