const { banUser } = require('../../lib/banimentos');

module.exports = {
  comando: 'ban',
  descricao: 'Banir membro (uso: *ban @numero*)',
  categoria: 'admin',
  exec: async (m, { sock, args, isGroupAdmin, isBotAdmin, participantes }) => {
    if (!m.isGroup) {
      return sock.sendMessage(m.chat, { text: '❌ Este comando só funciona em grupos.' }, { quoted: m });
    }

    if (!isGroupAdmin) {
      return sock.sendMessage(m.chat, { text: '❌ Apenas admins podem usar este comando.' }, { quoted: m });
    }

    if (!isBotAdmin) {
      return sock.sendMessage(m.chat, { text: '❌ Preciso ser admin para banir alguém.' }, { quoted: m });
    }

    const numero = args[0]?.replace(/\D/g, '');
    if (!numero) {
      return sock.sendMessage(m.chat, { text: '❌ Use: *ban @numero*' }, { quoted: m });
    }

    const targetId = `${numero}@s.whatsapp.net`;
    const isTargetAdmin = participantes.find(p => p.id === targetId)?.admin;

    if (isTargetAdmin) {
      return sock.sendMessage(m.chat, { text: '❌ Não posso banir outro admin.' }, { quoted: m });
    }

    await banUser(numero);
    await sock.sendMessage(m.chat, {
      text: `🚫 Usuário @${numero} banido!`,
      mentions: [targetId]
    }, { quoted: m });
  }
};
