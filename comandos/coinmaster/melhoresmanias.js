const { getMelhoresManias } = require('../../lib/scraping/melhoresmanias');

module.exports = {
  comando: 'melhoresmanias',
  descricao: 'Dicas sobre melhores manias',
  categoria: 'coinmaster',
  exec: async (m, { sock }) => {
    const texto = await getMelhoresManias();
    await sock.sendMessage(m.chat, { text: texto }, { quoted: m });
  }
};