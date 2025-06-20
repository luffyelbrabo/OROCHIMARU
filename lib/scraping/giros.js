// 📄 OROCHIMARU/lib/scraping/giros.js

const axios = require('axios'); const cheerio = require('cheerio'); const fs = require('fs'); const path = require('path');

const cachePath = path.join(__dirname, '../cache/giros_cache.json'); const CACHE_TTL = 10 * 60 * 1000; // 10 minutos

async function getLinksGiros() { // Verifica o cache if (fs.existsSync(cachePath)) { const cache = JSON.parse(fs.readFileSync(cachePath)); if (Date.now() - cache.timestamp < CACHE_TTL) { return cache.links; } }

const urls = [ 'https://cmrewards.net/', 'https://spinmaster.online/', 'https://ligadosgames.com/links-coin-master/' ];

const todosLinks = [];

for (const url of urls) { try { const { data } = await axios.get(url); const $ = cheerio.load(data);

$('a[href*="coinmaster"]:not([href*="facebook"])').each((_, el) => {
    const texto = $(el).text().trim();
    const link = $(el).attr('href');

    if (texto && link && /^https?:\/\//.test(link)) {
      todosLinks.push(`${texto}\n${link}`);
    }
  });
} catch (e) {
  console.error(`Erro ao acessar ${url}:`, e.message);
}

}

const linksUnicos = [...new Set(todosLinks)];

// Salva no cache fs.writeFileSync( cachePath, JSON.stringify({ timestamp: Date.now(), links: linksUnicos }, null, 2) );

return linksUnicos; }

module.exports = { getLinksGiros };

