const axios = require('axios');
const FormData = require('form-data');
const { sticker } = require('@whiskeysockets/baileys');

const API_KEY = 'SUA_API_REMOVE_BG'; // Substituir com a sua chave da remove.bg

module.exports = {
  comando: 'sbg',
  descricao: 'Criar figurinha sem fundo',
  categoria: 'figurinhas',
  exec: async (m, { sock }) => {
    const quoted = m.quoted || m;
    const mime = (quoted.msg || quoted).mimetype || '';

    if (!/image/.test(mime)) {
      return sock.sendMessage(m.chat, { text: '❌ Responda a uma imagem com o comando *sbg*' }, { quoted: m });
    }

    const buffer = await sock.downloadMediaMessage(quoted);

    const form = new FormData();
    form.append('image_file', buffer, { filename: 'img.png' });
    form.append('size', 'auto');

    try {
      const res = await axios.post('https://api.remove.bg/v1.0/removebg', form, {
        headers: {
          ...form.getHeaders(),
          'X-Api-Key': API_KEY
        },
        responseType: 'arraybuffer'
      });

      const stickerBuffer = await sticker(res.data, {
        pack: 'OROCHIMARU',
        author: 'Douglas',
        type: 'crop',
      });

      await sock.sendMessage(m.chat, { sticker: stickerBuffer }, { quoted: m });
    } catch (e) {
      console.log(e);
      await sock.sendMessage(m.chat, { text: '❌ Erro ao remover fundo. Verifique a API KEY ou limite diário.' }, { quoted: m });
    }
  }
};