// 📁 Caminho: OROCHIMARU/comandos/gerais/areia.js

const fs = require('fs'); const path = require('path'); const axios = require('axios'); const { createCanvas, loadImage, registerFont } = require('canvas');

// Opcional: registre uma fonte customizada // registerFont(path.join(__dirname, '../../lib/assets/sua_fonte.ttf'), { family: 'Custom' });

const localImagePath = path.join(__dirname, '../../lib/assets/areia.jpg');

module.exports = { comando: 'areia', descricao: 'Cria uma arte com areia usando texto', categoria: 'gerais', exec: async (m, { sock, args }) => { const texto = args.join(' '); if (!texto) { return sock.sendMessage(m.chat, { text: '❌ Use: areia SeuTextoAqui' }, { quoted: m }); }

const apiURL = `https://api.dapuhy.xyz/api/text2img/sandwriting?text=${encodeURIComponent(texto)}&apikey=SUA_API_KEY`;

try {
  const res = await axios.get(apiURL, { responseType: 'arraybuffer' });
  await sock.sendMessage(m.chat, {
    image: res.data,
    caption: '🖼️ Arte criada com areia (via API)'
  }, { quoted: m });
} catch (err) {
  console.warn('API falhou, usando fallback local:', err.message);

  try {
    const background = await loadImage(localImagePath);
    const canvas = createCanvas(background.width, background.height);
    const ctx = canvas.getContext('2d');

    ctx.drawImage(background, 0, 0);

    ctx.font = '40px Sans';
    ctx.fillStyle = '#000';
    ctx.textAlign = 'center';
    ctx.fillText(texto, canvas.width / 2, canvas.height / 2);

    const buffer = canvas.toBuffer();
    await sock.sendMessage(m.chat, {
      image: buffer,
      caption: '🖼️ Arte criada com areia (modo offline)'
    }, { quoted: m });
  } catch (error) {
    console.error('Erro no fallback:', error);
    await sock.sendMessage(m.chat, {
      text: '❌ Erro ao gerar arte com areia (offline).'
    }, { quoted: m });
  }
}

} };

