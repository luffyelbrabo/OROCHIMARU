const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const cachePath = path.join(__dirname, '../cache/eventos_cache.json');

const URL = 'https://support.coinmastergame.com/hc/pt/sections/360000286454-Eventos-Recompensas';

async function getEventos() {
  const { data } = await axios.get(URL);
  const $ = cheerio.load(data);
  const eventos = [];

  $('.article-list .item a').each((_, el) => {
    const titulo = $(el).text().trim();
    const href = $(el).attr('href');
    eventos.push({ titulo, link: 'https://support.coinmastergame.com' + href });
  });

  return eventos;
}

async function checkNovosEventos() {
  const novos = [];
  const atuais = await getEventos();

  let cache = { eventos: [] };
  if (fs.existsSync(cachePath)) {
    cache = JSON.parse(fs.readFileSync(cachePath));
  }

  // Verificar quais títulos são novos
  atuais.forEach(ev => {
    if (!cache.eventos.find(e => e.titulo === ev.titulo)) {
      novos.push(ev);
    }
  });

  // Atualizar cache
  fs.writeFileSync(cachePath, JSON.stringify({ eventos: atuais }, null, 2));
  return novos;
}

module.exports = { getEventos, checkNovosEventos };