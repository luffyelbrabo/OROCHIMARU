module.exports = {
  comando: 'linkgrupo',
  descricao: 'Envia o link do grupo',
  categoria: 'admin',
  exec: async (m, { sock, isGroupAdmin, isBotAdmin }) => {
    if (!m.isGroup) {
      return sock.sendMessage(m.chat, { text: '❌ Este comando só pode ser usado em grupos.' }, { quoted: m });
    }

    if (!isGroupAdmin) {
      return sock.sendMessage(m.chat, { text: '❌ Apenas admins podem solicitar o link do grupo.' }, { quoted: m });
    }

    if (!isBotAdmin) {
      return sock.sendMessage(m.chat, { text: '❌ Preciso ser admin para pegar o link do grupo.' }, { quoted: m });
    }

    const code = await sock.groupInviteCode(m.chat);
    const link = `https://chat.whatsapp.com/${code}`;
    await sock.sendMessage(m.chat, {
      text: `🔗 Link do grupo:\n${link}`
    }, { quoted: m });
  }
};