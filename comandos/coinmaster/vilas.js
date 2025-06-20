const { getValorVila } = require('../../lib/scraping/vilas');

module.exports = {
  comando: 'vila',
  descricao: 'Mostra informações sobre vilas',
  categoria: 'coinmaster',
  exec: async (m, { sock, args }) => {
    if (!args[0]) {
      return sock.sendMessage(m.chat, { text: '🏘️ Use: *vila <número>*' }, { quoted: m });
    }

    const vilaNum = parseInt(args[0]);
    if (isNaN(vilaNum)) {
      return sock.sendMessage(m.chat, { text: '❌ Vila deve ser um número.' }, { quoted: m });
    }

    const valor = await getValorVila(vilaNum);
    if (!valor) {
      return sock.sendMessage(m.chat, { text: `❌ Não foi possível obter o valor da vila ${vilaNum}.` }, { quoted: m });
    }

    await sock.sendMessage(m.chat, {
      text: `🏡 *Vila ${vilaNum}*\n💰 Custo estimado: R$ ${valor.toLocaleString('pt-BR')}`
    }, { quoted: m });
  }
};