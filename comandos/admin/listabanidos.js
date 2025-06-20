const { getBanidos } = require('../../lib/banimentos');

module.exports = {
  comando: 'listabanidos',
  descricao: 'Mostra a lista de banidos',
  categoria: 'admin',
  exec: async (m, { sock, isGroupAdmin }) => {
    if (!m.isGroup) {
      return sock.sendMessage(m.chat, { text: '❌ Este comando só pode ser usado em grupos.' }, { quoted: m });
    }

    if (!isGroupAdmin) {
      return sock.sendMessage(m.chat, { text: '❌ Apenas admins podem ver a lista de banidos.' }, { quoted: m });
    }

    const lista = await getBanidos();

    if (!lista.length) {
      return sock.sendMessage(m.chat, { text: '✅ Nenhum número banido.' }, { quoted: m });
    }

    const texto = lista.map((n, i) => `${i + 1}. @${n}`).join('\n');
    await sock.sendMessage(m.chat, {
      text: `🚫 Banidos:\n${texto}`,
      mentions: lista.map(n => `${n}@s.whatsapp.net`)
    }, { quoted: m });
  }
};