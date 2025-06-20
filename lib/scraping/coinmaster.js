const axios = require('axios');
const cheerio = require('cheerio');

async function getEventosCastelo() {
  try {
    const { data } = await axios.get('https://cmrewards.net/');
    const $ = cheerio.load(data);

    const eventos = [];
    
    $('article h2').each((i, el) => {
      const texto = $(el).text();
      if (texto.toLowerCase().includes('castelo') || texto.toLowerCase().includes('castle')) {
        eventos.push(texto);
      }
    });

    return eventos.length ? eventos.join('\n') : '⚠️ Nenhum evento de castelo encontrado no momento.';
  } catch (err) {
    console.error('Erro ao buscar eventos:', err.message);
    return '❌ Erro ao buscar eventos do castelo.';
  }
}

module.exports = { getEventosCastelo };