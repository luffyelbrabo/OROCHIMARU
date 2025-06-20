const { getDicaCasteloGelo } = require('../../lib/scraping/castelogelo');

module.exports = {
  comando: 'castelogelo',
  descricao: 'Dicas do castelo de gelo',
  categoria: 'coinmaster',
  exec: async (m, { sock }) => {
    const texto = await getDicaCasteloGelo();
    await sock.sendMessage(m.chat, { text: texto }, { quoted: m });
  }
};