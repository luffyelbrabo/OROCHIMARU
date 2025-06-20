const axios = require('axios');
const cheerio = require('cheerio');

async function getCorteEspecial() {
  const url = 'https://cmrewards.net'; // substitua pelo site certo quando souber
  const selector = 'h2:contains("Corte Especial") + p';

  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const resultados = [];

    $(selector).each((_, el) => {
      resultados.push($(el).text().trim());
    });

    return resultados.join('\n\n') || 'Nenhuma informação de corte encontrada.';
  } catch (e) {
    return `❌ Erro ao buscar dados: ${e.message}`;
  }
}

module.exports = { getCorteEspecial };