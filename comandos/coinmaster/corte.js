const { getCorteEspecial } = require('../../lib/scraping/corte');

module.exports = {
  comando: 'corte',
  descricao: 'Informações sobre cortes especiais de eventos',
  categoria: 'coinmaster',
  exec: async (m, { sock }) => {
    const texto = await getCorteEspecial();
    await sock.sendMessage(m.chat, { text: `✂️ *Cortes Especiais:*\n\n${texto}` }, { quoted: m });
  }
};