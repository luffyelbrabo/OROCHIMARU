const { getEventosCastelo } = require('../../lib/scraping/coinmaster');

module.exports = {
  comando: 'castelo',
  descricao: 'Informa sobre castelo Coin Master',
  categoria: 'coinmaster',
  exec: async (m, { sock }) => {
    const texto = await getEventosCastelo();
    await sock.sendMessage(m.chat, { text: `🏰 *Evento Castelo:*\n\n${texto}` }, { quoted: m });
  }
};