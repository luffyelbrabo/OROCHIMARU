const path = require('path');
const fs = require('fs');

module.exports = {
  comando: 'sound',
  descricao: 'Reproduz áudio curto por palavra-chave',
  categoria: 'audio',
  exec: async (m, { sock, args }) => {
    const palavra = args[0]?.toLowerCase();
    if (!palavra) {
      return sock.sendMessage(m.chat, { text: '❌ Informe uma palavra-chave.' }, { quoted: m });
    }

    const som = path.resolve(__dirname, `../../media/audios/${palavra}.mp3`);

    // Verifica se o arquivo existe
    if (!fs.existsSync(som)) {
      return sock.sendMessage(m.chat, {
        text: `❌ Áudio "${palavra}" não encontrado.`,
      }, { quoted: m });
    }

    await sock.sendMessage(m.chat, {
      audio: { url: som },
      mimetype: 'audio/mp4'
    }, { quoted: m });
  }
};