module.exports = {
  comando: 'abrir',
  descricao: 'Abrir grupo para todos',
  categoria: 'admin',
  exec: async (m, { sock, isGroupAdmin, isBotAdmin }) => {
    if (!m.isGroup) {
      return sock.sendMessage(m.chat, { text: '❌ Este comando só pode ser usado em grupos.' }, { quoted: m });
    }

    if (!isGroupAdmin) {
      return sock.sendMessage(m.chat, { text: '❌ Você precisa ser admin para usar este comando.' }, { quoted: m });
    }

    if (!isBotAdmin) {
      return sock.sendMessage(m.chat, { text: '❌ Eu preciso ser admin para abrir o grupo.' }, { quoted: m });
    }

    await sock.groupSettingUpdate(m.chat, 'not_announcement');
    await sock.sendMessage(m.chat, { text: '🔓 Grupo aberto para todos falarem.' }, { quoted: m });
  }
};