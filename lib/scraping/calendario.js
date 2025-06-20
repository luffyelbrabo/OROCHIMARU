const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const cachePath = path.join(__dirname, '../cache/calendario_cache.json');
const CACHE_TTL = 10 * 60 * 1000; // 10 minutos

async function getCalendario() {
  // Verifica se o cache ainda é válido
  if (fs.existsSync(cachePath)) {
    const cache = JSON.parse(fs.readFileSync(cachePath));
    if (Date.now() - cache.timestamp < CACHE_TTL) {
      return cache.texto;
    }
  }

  const eventosPorDia = {
    segunda: [],
    terca: [],
    quarta: [],
    quinta: [],
    sexta: [],
    sabado: [],
    domingo: [],
    outros: []
  };

  try {
    // Site 1: ligadosgames.com
    const { data: html1 } = await axios.get('https://ligadosgames.com/calendario-coin-master/');
    const $1 = cheerio.load(html1);

    $1('h2, h3, h4').each((_, el) => {
      const dia = $1(el).text().toLowerCase();
      let diaChave = Object.keys(eventosPorDia).find(k => dia.includes(k)) || 'outros';

      let lista = $1(el).next('ul');
      if (lista.length === 0) lista = $1(el).next().find('ul');

      lista.find('li').each((_, li) => {
        const texto = $1(li).text().trim().replace(/\n/g, ' ');
        if (texto) eventosPorDia[diaChave].push(texto);
      });
    });

    // Site 2: spinmaster.online
    const { data: html2 } = await axios.get('https://spinmaster.online/');
    const $2 = cheerio.load(html2);

    $2('.elementor-widget-container li').each((_, li) => {
      const texto = $2(li).text().trim();
      const diaDetectado = Object.keys(eventosPorDia).find(dia =>
        texto.toLowerCase().includes(dia)
      );
      if (diaDetectado) {
        eventosPorDia[diaDetectado].push(texto);
      } else {
        eventosPorDia.outros.push(texto);
      }
    });
  } catch (err) {
    console.error('Erro ao coletar eventos:', err.message);
    return '❌ Não foi possível carregar o calendário no momento.';
  }

  // Formatar resposta
  let resultado = '📆 *CALENDÁRIO DE EVENTOS COIN MASTER*\n\n';

  for (const dia of ['segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado', 'domingo']) {
    const eventos = eventosPorDia[dia];
    if (eventos.length > 0) {
      resultado += `• *${capitalize(dia)}*\n`;
      eventos.forEach(ev => {
        resultado += `${ev}\n`;
      });
      resultado += '\n';
    }
  }

  if (eventosPorDia.outros.length > 0) {
    resultado += '• *Outros Dias / Sem Data Fixa*\n';
    eventosPorDia.outros.forEach(ev => {
      resultado += `${ev}\n`;
    });
  }

  resultado += '\n*Obs: Os horários podem sofrer alterações sem aviso prévio.*\n';
  resultado += '*Horário de Brasília*\n';
  resultado += 'Fonte: cmrewards.net, spinmaster.online, ligadosgames.com';

  // Salva no cache
  fs.writeFileSync(cachePath, JSON.stringify({
    timestamp: Date.now(),
    texto: resultado
  }, null, 2));

  return resultado;
}

function capitalize(txt) {
  return txt.charAt(0).toUpperCase() + txt.slice(1);
}

module.exports = { getCalendario };