const { getRaseVariations } = require('../../lib/scraping/rase');

module.exports = {
  comando: 'rase',
  descricao: 'Exibe sequência rase',
  categoria: 'coinmaster',
  exec: async (m, { sock }) => {
    const sequencias = await getRaseVariations();
    const texto = sequencias.length > 0
      ? `🤖 *Sequência Rase do Coin Master:*\n\n${sequencias.join('\n')}`
      : '🤖 Nenhuma sequência Rase encontrada no momento.';
    await sock.sendMessage(m.chat, { text: texto }, { quoted: m });
  }
};