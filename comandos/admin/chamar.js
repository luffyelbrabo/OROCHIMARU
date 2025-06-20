module.exports = {
  comando: 'chamar',
  descricao: 'Mencionar todos os membros',
  categoria: 'admin',
  exec: async (m, { sock, participantes, isGroupAdmin, isBotAdmin }) => {
    if (!m.isGroup) {
      return sock.sendMessage(m.chat, { text: '❌ Este comando só pode ser usado em grupos.' }, { quoted: m });
    }

    if (!isGroupAdmin) {
      return sock.sendMessage(m.chat, { text: '❌ Apenas admins podem usar esse comando.' }, { quoted: m });
    }

    if (!isBotAdmin) {
      return sock.sendMessage(m.chat, { text: '❌ Preciso ser admin para mencionar todos.' }, { quoted: m });
    }

    const mentions = participantes.map(p => p.id);
    const texto = '👥 Chamando todos:\n' + mentions.map(id => `@${id.split('@')[0]}`).join(' ');

    await sock.sendMessage(m.chat, {
      text: texto,
      mentions
    }, { quoted: m });
  }
};