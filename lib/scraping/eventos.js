const axios = require('axios');
const cheerio = require('cheerio');

async function buscarCmRewards() {
  try {
    const { data } = await axios.get('https://cmrewards.net');
    const $ = cheerio.load(data);
    const eventos = [];

    $('a[href*="coinmaster://"]').each((i, el) => {
      eventos.push({
        titulo: $(el).text().trim(),
        link: $(el).attr('href')
      });
    });

    return eventos;
  } catch (e) {
    console.error('Erro ao buscar cmrewards.net:', e.message);
    return [];
  }
}

async function buscarSpinsAndCoins() {
  try {
    const { data } = await axios.get('https://spinsandcoins.com');
    const $ = cheerio.load(data);
    const eventos = [];

    $('a[href*="coinmaster://"]').each((i, el) => {
      eventos.push({
        titulo: $(el).text().trim(),
        link: $(el).attr('href')
      });
    });

    return eventos;
  } catch (e) {
    console.error('Erro ao buscar spinsandcoins.com:', e.message);
    return [];
  }
}

async function buscarDailySpinLinks() {
  try {
    const { data } = await axios.get('https://dailyspinlinks.com');
    const $ = cheerio.load(data);
    const eventos = [];

    $('a[href*="coinmaster://"]').each((i, el) => {
      eventos.push({
        titulo: $(el).text().trim(),
        link: $(el).attr('href')
      });
    });

    return eventos;
  } catch (e) {
    console.error('Erro ao buscar dailyspinlinks.com:', e.message);
    return [];
  }
}

async function buscarLigadosGames() {
  try {
    const { data } = await axios.get('https://ligadosgames.com/coin-master/');
    const $ = cheerio.load(data);
    const eventos = [];

    $('a[href*="coinmaster://"]').each((i, el) => {
      eventos.push({
        titulo: $(el).text().trim(),
        link: $(el).attr('href')
      });
    });

    return eventos;
  } catch (e) {
    console.error('Erro ao buscar ligadosgames.com:', e.message);
    return [];
  }
}

async function buscarTodosEventos() {
  const [cm, sc, ds, lg] = await Promise.all([
    buscarCmRewards(),
    buscarSpinsAndCoins(),
    buscarDailySpinLinks(),
    buscarLigadosGames()
  ]);

  const combinado = [...cm, ...sc, ...ds, ...lg];

  // Remover duplicados pelo link
  const unicos = [];
  const linksVistos = new Set();

  for (const evento of combinado) {
    if (!linksVistos.has(evento.link)) {
      linksVistos.add(evento.link);
      unicos.push(evento);
    }
  }

  return unicos;
}

module.exports = { buscarTodosEventos };
