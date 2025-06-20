const { getCalendario } = require('../../lib/scraping/calendario');

module.exports = {
  comando: 'calendario',
  descricao: 'Calendário de eventos do Coin Master (via scraping)',
  categoria: 'coinmaster',
  exec: async (m, { sock }) => {
    const texto = await getCalendario();
    await sock.sendMessage(m.chat, { text: texto }, { quoted: m });
  }
};