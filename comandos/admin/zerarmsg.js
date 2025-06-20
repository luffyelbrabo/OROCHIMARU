const db = require('../../lib/db');

module.exports = {
  comando: 'zerarmsg',
  descricao: 'Zera a contagem de mensagens do grupo',
  categoria: 'admin',
  exec: async (m, { sock, isGroupAdmin }) => {
    if (!m.isGroup) {
      return sock.sendMessage(m.chat, {
        text: '❌ Este comando só pode ser usado em grupos.'
      }, { quoted: m });
    }

    if (!isGroupAdmin) {
      return sock.sendMessage(m.chat, {
        text: '❌ Apenas admins podem zerar a contagem de mensagens.'
      }, { quoted: m });
    }

    try {
      db.run('DELETE FROM mensagens WHERE grupo = ?', [m.chat], (err) => {
        if (err) {
          return sock.sendMessage(m.chat, {
            text: '❌ Erro ao zerar contagem.'
          }, { quoted: m });
        }

        sock.sendMessage(m.chat, {
          text: '🔄 Contagem de mensagens zerada com sucesso!'
        }, { quoted: m });
      });
    } catch (err) {
      await sock.sendMessage(m.chat, {
        text: '❌ Ocorreu um erro inesperado ao tentar zerar a contagem.'
      }, { quoted: m });
    }
  }
};