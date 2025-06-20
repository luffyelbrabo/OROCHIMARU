const { unbanUser } = require('../../lib/banimentos');

module.exports = {
  comando: 'unban',
  descricao: 'Desbanir número (uso: *unban 55999999999*)',
  categoria: 'admin',
  exec: async (m, { sock, args, isGroupAdmin }) => {
    if (!m.isGroup) {
      return sock.sendMessage(m.chat, { text: '❌ Este comando só pode ser usado em grupos.' }, { quoted: m });
    }

    if (!isGroupAdmin) {
      return sock.sendMessage(m.chat, { text: '❌ Apenas admins podem desbanir usuários.' }, { quoted: m });
    }

    const numero = args[0]?.replace(/\D/g, '');
    if (!numero || numero.length < 10) {
      return sock.sendMessage(m.chat, { text: '❌ Use: *unban 55999999999*' }, { quoted: m });
    }

    try {
      await unbanUser(numero);
      await sock.sendMessage(m.chat, {
        text: `✅ Usuário @${numero} desbanido!`,
        mentions: [`${numero}@s.whatsapp.net`]
      }, { quoted: m });
    } catch (err) {
      await sock.sendMessage(m.chat, { text: '❌ Erro ao desbanir o usuário.' }, { quoted: m });
    }
  }
};