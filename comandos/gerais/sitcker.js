const { writeFileSync, unlinkSync } = require('fs');
const { fromBuffer } = require('file-type');
const { sticker } = require('../../lib/functions');

module.exports = {
  comando: 'sticker',
  descricao: 'Transforma imagem ou vídeo em figurinha',
  categoria: 'gerais',
  exec: async (m, { sock }) => {
    if (!m.quoted || !(m.quoted.image || m.quoted.video)) {
      return sock.sendMessage(m.chat, { text: '❌ Responda a uma imagem ou vídeo com *sticker*' }, { quoted: m });
    }

    const mime = m.quoted.mtype;
    const media = await sock.downloadMediaMessage(m.quoted);

    const stickerBuffer = await sticker(media, {
      pack: 'OROCHIMARU',
      author: 'by Douglas',
      type: 'default'
    });

    await sock.sendMessage(m.chat, { sticker: stickerBuffer }, { quoted: m });
  }
};