// Caminho: OROCHIMARU/comandos/especiais/areia.js

const axios = require('axios'); const fs = require('fs'); const path = require('path'); const { sticker } = require('@whiskeysockets/baileys');

const imagemFallback = path.join(__dirname, '../../lib/assets/areia.jpg');

module.exports = { comando: 'areia', descricao: 'Criar arte de areia com texto', categoria: 'figurinhas', exec: async (m, { sock, args }) => { const texto = args.join(' '); if (!texto) { return sock.sendMessage(m.chat, { text: '❌ Use: areia SeuTextoAqui' }, { quoted: m }); }

const url = `https://api.popcat.xyz/sand?text=${encodeURIComponent(texto)}`;

try {
  const res = await axios.get(url, { responseType: 'arraybuffer' });
  const stickerBuffer = await sticker(res.data, {
    pack: 'OROCHIMARU',
    author: 'Douglas',
    type: 'crop'
  });

  await sock.sendMessage(m.chat, { sticker: stickerBuffer }, { quoted: m });
} catch (e) {
  console.warn('⚠️ PopCat API falhou. Usando fallback local.');
  try {
    const imagem = fs.readFileSync(imagemFallback);
    const stickerBuffer = await sticker(imagem, {
      pack: 'OROCHIMARU',
      author: 'Douglas',
      type: 'crop'
    });

    await sock.sendMessage(m.chat, { sticker: stickerBuffer }, { quoted: m });
  } catch (fallbackError) {
    console.error('Erro no fallback da arte de areia:', fallbackError);
    await sock.sendMessage(m.chat, { text: '❌ Erro ao gerar arte de areia (API e fallback falharam).' }, { quoted: m });
  }
}

} };

