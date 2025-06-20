const googleTTS = require('google-tts-api');

module.exports = {
  comando: 'tts',
  descricao: 'Converte texto em áudio',
  categoria: 'audio',
  exec: async (m, { sock, args }) => {
    const texto = args.join(' ');
    if (!texto) {
      return sock.sendMessage(m.chat, {
        text: '❌ Forneça um texto para converter em áudio.',
      }, { quoted: m });
    }

    if (texto.length > 200) {
      return sock.sendMessage(m.chat, {
        text: '❌ O texto deve ter no máximo 200 caracteres.',
      }, { quoted: m });
    }

    const url = googleTTS.getAudioUrl(texto, {
      lang: 'pt',
      slow: false
    });

    await sock.sendMessage(m.chat, {
      audio: { url },
      mimetype: 'audio/mp4'
    }, { quoted: m });
  }
};