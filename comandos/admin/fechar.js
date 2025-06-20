module.exports = {
  comando: 'fechar',
  descricao: 'Fechar grupo (somente admins podem falar)',
  categoria: 'admin',
  exec: async (m, { sock, isGroupAdmin, isBotAdmin }) => {
    if (!m.isGroup) {
      return sock.sendMessage(m.chat, { text: '❌ Este comando só pode ser usado em grupos.' }, { quoted: m });
    }

    if (!isGroupAdmin) {
      return sock.sendMessage(m.chat, { text: '❌ Apenas admins podem usar esse comando.' }, { quoted: m });
    }

    if (!isBotAdmin) {
      return sock.sendMessage(m.chat, { text: '❌ Preciso ser admin para fechar o grupo.' }, { quoted: m });
    }

    await sock.groupSettingUpdate(m.chat, 'announcement');
    await sock.sendMessage(m.chat, {
      text: '🔒 Grupo fechado. Apenas administradores podem enviar mensagens.'
    }, { quoted: m });
  }
};