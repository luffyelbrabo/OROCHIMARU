const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const cachePath = path.join(__dirname, 'eventosCache.json');

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
    return null;
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
    return null;
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
    return null;
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
    return null;
  }
}

// Função para ler cache local
function lerCache() {
  try {
    if (fs.existsSync(cachePath)) {
      const json = fs.readFileSync(cachePath, 'utf-8');
      return JSON.parse(json);
    }
  } catch (e) {
    console.error('Erro ao ler cache local:', e.message);
  }
  return [];
}

// Função para salvar cache local
function salvarCache(dados) {
  try {
    fs.writeFileSync(cachePath, JSON.stringify(dados, null, 2), 'utf-8');
  } catch (e) {
    console.error('Erro ao salvar cache local:', e.message);
  }
}

async function buscarTodosEventos() {
  // Buscar em paralelo
  const resultados = await Promise.all([
    buscarCmRewards(),
    buscarSpinsAndCoins(),
    buscarDailySpinLinks(),
    buscarLigadosGames()
  ]);

  // Filtrar resultados válidos (não nulos)
  const validos = resultados.filter(res => Array.isArray(res));

  if (validos.length === 0) {
    // Se todos falharam, usa cache local
    console.log('⚠️ Usando cache local por indisponibilidade dos sites');
    return lerCache();
  }

  // Combinar todos os eventos válidos
  const combinado = validos.flat();

  // Remover duplicados pelo link
  const linksVistos = new Set();
  const unicos = [];

  for (const evento of combinado) {
    if (!linksVistos.has(evento.link)) {
      linksVistos.add(evento.link);
      unicos.push(evento);
    }
  }

  // Atualiza cache local
  salvarCache(unicos);

  return unicos;
}

module.exports = { buscarTodosEventos };
