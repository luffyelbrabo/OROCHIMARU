const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const CACHE_PATH = path.join(__dirname, '../cache/castelogelo.json');
const CACHE_TEMPO_MS = 1000 * 60 * 60 * 3; // 3 horas

async function getDicaCasteloGelo() {
  // Verifica se existe cache válido
  if (fs.existsSync(CACHE_PATH)) {
    const cache = JSON.parse(fs.readFileSync(CACHE_PATH));
    const tempoCache = new Date(cache.timestamp);
    if (Date.now() - tempoCache.getTime() < CACHE_TEMPO_MS) {
      return cache.texto;
    }
  }

  // Sites para tentar scraping
  const sites = [
    {
      url: 'https://cmrewards.net',
      parse: $ => $('h2:contains("Castelo de Gelo")').next('p').text()
    },
    {
      url: 'https://dailyspinlink.com',
      parse: $ => $('.evento:contains("Castelo de Gelo") .descricao').first().text()
    },
    {
      url: 'https://spinmaster.online',
      parse: $ => $('.ice-castle .tip-text').first().text()
    }
  ];

  let texto = '❄️ Não foi possível obter dicas do castelo de gelo no momento.';

  for (const site of sites) {
    try {
      const { data } = await axios.get(site.url, { timeout: 10000 });
      const $ = cheerio.load(data);
      const dica = site.parse($)?.trim();
      if (dica && dica.length > 10) {
        texto = `❄️ *Castelo de Gelo:*\n\n${dica}`;
        break;
      }
    } catch (e) {
      continue;
    }
  }

  // Salva no cache
  fs.writeFileSync(CACHE_PATH, JSON.stringify({
    timestamp: new Date().toISOString(),
    texto
  }, null, 2));

  return texto;
}

module.exports = {
  getDicaCasteloGelo
};