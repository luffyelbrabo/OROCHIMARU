const axios = require('axios');
const FormData = require('form-data');
const { sticker } = require('../../lib/functions');
const config = require('../../config/settings');

module.exports = {
  comando: 'sbg',
  descricao: 'Cria figurinha removendo o fundo da imagem',
  categoria: 'gerais',
  exec: async (m, { sock }) => {
    const quoted = m.quoted || m;
    const mime = (quoted.msg || quoted).mimetype || '';

    if (!/image/.test(mime)) {
      return sock.sendMessage(m.chat, { text: '❌ Responda a uma imagem com *sbg*' }, { quoted: m });
    }

    const buffer = await sock.downloadMediaMessage(quoted);

    const form = new FormData();
    form.append('image_file', buffer, { filename: 'imagem.png' });
    form.append('size', 'auto');

    try {
      const res = await axios.post('https://api.remove.bg/v1.0/removebg', form, {
        headers: {
          ...form.getHeaders(),
          'X-Api-Key': config.VOICERSS_KEY || 'SUA_API_KEY_AQUI'
        },
        responseType: 'arraybuffer'
      });

      const stickerBuffer = await sticker(res.data, {
        pack: 'OROCHIMARU',
        author: 'by Douglas',
        type: 'default'
      });

      await sock.sendMessage(m.chat, { sticker: stickerBuffer }, { quoted: m });

    } catch (err) {
      console.log(err);
      sock.sendMessage(m.chat, {
        text: '❌ Erro ao remover fundo. Verifique a chave da API ou o limite diário.',
        quoted: m
      });
    }
  }
};