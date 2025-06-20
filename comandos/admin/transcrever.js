const transcreverAudio = require('../../lib/transcricao');

module.exports = {
  comando: 'transcrever',
  descricao: 'Transcreve áudio em texto',
  categoria: 'admin',
  exec: async (m, { sock, isGroupAdmin }) => {
    if (!m.quoted?.audioMessage) {
      return sock.sendMessage(m.chat, { text: '❌ Responda a um áudio para transcrever.' }, { quoted: m });
    }

    // Se quiser restringir a admins:
    // if (!isGroupAdmin) {
    //   return sock.sendMessage(m.chat, { text: '❌ Apenas admins podem usar esse comando.' }, { quoted: m });
    // }

    try {
      const texto = await transcreverAudio(m.quoted.audioMessage);
      await sock.sendMessage(m.chat, {
        text: `📝 Transcrição:\n\n${texto}`
      }, { quoted: m });
    } catch (err) {
      await sock.sendMessage(m.chat, {
        text: '❌ Erro ao transcrever o áudio.'
      }, { quoted: m });
    }
  }
};