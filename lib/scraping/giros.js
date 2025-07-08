// 📄 OROCHIMARU/lib/scraping/giros.js

const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const cachePath = path.join(__dirname, '../cache/giros_cache.json');
const CACHE_TTL = 10 * 60 * 1000; // 10 minutos

async function getLinksGiros() {
  // Usa cache se disponível e válido
  if (fs.existsSync(cachePath)) {
    const cache = JSON.parse(fs.readFileSync(cachePath));
    if (Date.now() - cache.timestamp < CACHE_TTL) {
      return cache.links;
    }
  }

  const resultado = [];

  try {
    const { data } = await axios.get('https://static.moonactive.net/static/coinmaster/reward/reward2.html');
    const $ = cheerio.load(data);

    const elementos = $('a[href*="coinmaster.com"]').toArray();

    for (const el of elementos) {
      const url = $(el).attr('href')?.trim();
      const texto = $(el).text().trim();

      if (!url || !/^https?:\/\//.test(url)) continue;

      // Extrair data/hora a partir do texto do link (caso tenha), senão gera a hora atual
      const elementoPai = $(el).parent();
      let dataHora = elementoPai.find('small').text().trim() || null;

      if (!dataHora) {
        const anterior = $(el).prev('small');
        if (anterior.length) {
          dataHora = anterior.text().trim();
        }
      }

      // Se mesmo assim não achou, usa a hora atual
      if (!dataHora) {
        const agora = new Date();
        dataHora = agora.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
      }

      resultado.push({ url, dataHora });
    }

  } catch (e) {
    console.error('Erro ao acessar reward2.html:', e.message);
  }

  // Salva no cache
  fs.writeFileSync(cachePath, JSON.stringify({
    timestamp: Date.now(),
    links: resultado
  }, null, 2));

  return resultado;
}

module.exports = { getLinksGiros };
