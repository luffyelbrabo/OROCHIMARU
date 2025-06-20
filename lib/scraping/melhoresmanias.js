const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const cachePath = path.join(__dirname, '../cache/melhoresmanias_cache.json');
const cacheDuration = 1000 * 60 * 60; // 1 hora

const sites = [
  { url: 'https://cmrewards.net', selector: 'h2:contains("Melhores Manias") + p' },
  { url: 'https://spinmaster.online', selector: '.mania-tips .tip' },
  { url: 'https://dailyspinlink.com', selector: '.evento:contains("Melhores Manias") .descricao' }
];

function readCache() {
  if (fs.existsSync(cachePath)) {
    const data = JSON.parse(fs.readFileSync(cachePath));
    if (Date.now() - data.timestamp < cacheDuration) {
      return data.resultado;
    }
  }
  return null;
}

function saveCache(resultado) {
  fs.writeFileSync(cachePath, JSON.stringify({
    timestamp: Date.now(),
    resultado
  }, null, 2));
}

async function getMelhoresManias() {
  const cache = readCache();
  if (cache) return cache;

  let dicas = new Set();

  for (const site of sites) {
    try {
      const { data } = await axios.get(site.url);
      const $ = cheerio.load(data);
      $(site.selector).each((_, el) => {
        dicas.add($(el).text().trim());
      });
    } catch (e) {
      console.error(`[SCRAPING] Erro ao acessar ${site.url}:`, e.message);
    }
  }

  const texto = [...dicas].join('\n\n') || '⚠️ Nenhuma dica encontrada no momento.';
  saveCache(texto);
  return `🔥 *Melhores Manias*:\n\n${texto}`;
}

module.exports = { getMelhoresManias };