module.exports = {
  comando: 'atenção',
  descricao: 'Enviar mensagem de atenção para todos',
  categoria: 'admin',
  exec: async (m, { sock, participantes, isGroupAdmin, isBotAdmin }) => {
    if (!m.isGroup) {
      return sock.sendMessage(m.chat, { text: '❌ Este comando só pode ser usado em grupos.' }, { quoted: m });
    }

    if (!isGroupAdmin) {
      return sock.sendMessage(m.chat, { text: '❌ Você precisa ser admin para usar este comando.' }, { quoted: m });
    }

    if (!isBotAdmin) {
      return sock.sendMessage(m.chat, { text: '❌ Eu preciso ser admin para mencionar todos.' }, { quoted: m });
    }

    const mentions = participantes.map(p => p.id);
    await sock.sendMessage(m.chat, {
      text: `⚠️ Atenção, membros do grupo!`,
      mentions
    }, { quoted: m });
  }
};
