const { writeFile } = require('fs/promises');
const { tmpdir } = require('os');
const path = require('path');
const { sticker } = require('@whiskeysockets/baileys');

module.exports = {
  comando: 'sticker',
  descricao: 'Transformar mídia em figurinha',
  categoria: 'figurinhas',
  exec: async (m, { sock }) => {
    const quoted = m.quoted || m;
    const mime = (quoted.msg || quoted).mimetype || '';

    if (!/image|video/.test(mime)) {
      return sock.sendMessage(m.chat, { text: '❌ Envie uma imagem ou vídeo com até 10 segundos com o comando *sticker*' }, { quoted: m });
    }

    const buffer = await sock.downloadMediaMessage(quoted);
    const stickerBuffer = await sticker(buffer, {
      pack: 'OROCHIMARU',
      author: 'Douglas',
      type: mime.includes('video') ? 'full' : 'crop',
    });

    await sock.sendMessage(m.chat, { sticker: stickerBuffer }, { quoted: m });
  }
};