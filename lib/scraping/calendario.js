// OROCHIMARU/lib/scraping/calendario.js
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const cachePath = path.join(__dirname, '../cache/calendario_cache.json');
const CACHE_TTL = 30 * 60 * 1000; // 30 minutos

async function getCalendario() {
  if (fs.existsSync(cachePath)) {
    const cache = JSON.parse(fs.readFileSync(cachePath));
    if (Date.now() - cache.timestamp < CACHE_TTL) {
      return cache.texto;
    }
  }

  const eventosPorDia = {
    segunda: [], terca: [], quarta: [], quinta: [], sexta: [], sabado: [], domingo: [], outros: []
  };

  try {
    // Fonte 1: support.coinmastergame.com
    const { data: html1 } = await axios.get('https://support.coinmastergame.com/hc/en-us/sections/360000286454-Events-Rewards');
    const $1 = cheerio.load(html1);
    $1('.article-list .article-list-item').each((_, el) => {
      const titulo = $1(el).find('.article-list-link').text().trim();
      distribuirEvento(titulo, eventosPorDia);
    });

    // Fonte 2: coinmaster.guru
    const { data: html2 } = await axios.get('https://coinmaster.guru/category/events/');
    const $2 = cheerio.load(html2);
    $2('.td-module-title a').each((_, el) => {
      const titulo = $2(el).text().trim();
      distribuirEvento(titulo, eventosPorDia);
    });

  } catch (err) {
    console.error('❌ Erro no scraping:', err.message);
    return '❌ Não foi possível carregar o calendário no momento.';
  }

  // Montar texto
  let resultado = '📆 *CALENDÁRIO DE EVENTOS COIN MASTER*\n\n';
  for (const dia of ['segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado', 'domingo']) {
    const eventos = eventosPorDia[dia];
    if (eventos.length > 0) {
      resultado += `• *${capitalize(dia)}*\n`;
      eventos.forEach(e => resultado += `${e}\n`);
      resultado += '\n';
    }
  }
  if (eventosPorDia.outros.length) {
    resultado += '• *Outros Dias / Sem Data Fixa*\n';
    eventosPorDia.outros.forEach(e => resultado += `${e}\n`);
  }

  resultado += '\n*Obs: Os horários podem sofrer alterações sem aviso prévio.*\n';
  resultado += 'Horário: Brasília\n';
  resultado += 'Fonte: support.coinmastergame.com, coinmaster.guru';

  // Salvar no cache
  fs.writeFileSync(cachePath, JSON.stringify({
    timestamp: Date.now(),
    texto: resultado
  }, null, 2));

  return resultado;
}

function distribuirEvento(texto, eventosPorDia) {
  const t = texto.toLowerCase();
  if (t.includes('monday')) eventosPorDia.segunda.push(texto);
  else if (t.includes('tuesday')) eventosPorDia.terca.push(texto);
  else if (t.includes('wednesday')) eventosPorDia.quarta.push(texto);
  else if (t.includes('thursday')) eventosPorDia.quinta.push(texto);
  else if (t.includes('friday')) eventosPorDia.sexta.push(texto);
  else if (t.includes('saturday')) eventosPorDia.sabado.push(texto);
  else if (t.includes('sunday')) eventosPorDia.domingo.push(texto);
  else eventosPorDia.outros.push(texto);
}

function capitalize(txt) {
  return txt.charAt(0).toUpperCase() + txt.slice(1);
}

module.exports = { getCalendario };
