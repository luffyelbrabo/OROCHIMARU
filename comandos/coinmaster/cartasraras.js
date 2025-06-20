const fs = require('fs');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');

const caminhoJSON = path.join(__dirname, '../../lib/dados/cartasraras.json');

module.exports = {
  comando: 'cartasraras',
  descricao: 'Cartas raras do Coin Master por raridade e set',
  categoria: 'coinmaster',
  exec: async (m, { sock }) => {
    try {
      let usarCache = false;

      if (fs.existsSync(caminhoJSON)) {
        const json = JSON.parse(fs.readFileSync(caminhoJSON));
        const hoje = new Date().toISOString().split('T')[0];
        if (json.data === hoje && json.cartas) usarCache = true;
      }

      let cartasPorRaridade = {};

      if (usarCache) {
        cartasPorRaridade = JSON.parse(fs.readFileSync(caminhoJSON)).cartas;
      } else {
        const url = 'https://www.ligadosgames.com/cartas-raras-coin-master/';
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        $('h2, h3').each((_, el) => {
          const titulo = $(el).text().trim(); // raridade ou nome do set
          const lista = $(el).nextUntil('h2, h3', 'ul');

          if (lista.length > 0) {
            const cartas = [];
            lista.find('li').each((_, li) => {
              const item = $(li).text().trim();
              if (item) cartas.push(item);
            });

            if (cartas.length) cartasPorRaridade[titulo] = cartas;
          }
        });

        fs.writeFileSync(caminhoJSON, JSON.stringify({
          data: new Date().toISOString().split('T')[0],
          cartas: cartasPorRaridade
        }, null, 2));
      }

      if (!Object.keys(cartasPorRaridade).length) {
        return sock.sendMessage(m.chat, { text: '⚠️ Nenhuma carta rara encontrada.' }, { quoted: m });
      }

      let mensagem = '📚 *Cartas Raras do CM por Raridade & Set:*\n\n';

      // Ordem preferida
      const ordem = ['Cartas Raras', 'Muito Raras', 'Extremamente Raras', 'Épicas'];
      ordem.forEach(nivel => {
        if (cartasPorRaridade[nivel]) {
          mensagem += `✨ *${nivel}*\n`;
          cartasPorRaridade[nivel].forEach(c => mensagem += `- ${c}\n`);
          mensagem += '\n';
        }
      });

      // Agora os sets específicos
      Object.entries(cartasPorRaridade).forEach(([titulo, cartas]) => {
        if (!ordem.includes(titulo)) {
          mensagem += `📦 *${titulo}*\n`;
          cartas.forEach(c => mensagem += `- ${c}\n`);
          mensagem += '\n';
        }
      });

      await sock.sendMessage(m.chat, { text: mensagem.trim() }, { quoted: m });

    } catch (err) {
      console.error('Erro ao buscar cartas raras:', err);
      await sock.sendMessage(m.chat, {
        text: '❌ Erro ao processar cartas raras.'
      }, { quoted: m });
    }
  }
};