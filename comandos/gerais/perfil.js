const Jimp = require('jimp');

module.exports = {
  comando: 'perfil',
  descricao: 'Gera uma imagem com o perfil do usuário',
  categoria: 'gerais',

  exec: async (m, { sock }) => {
    try {
      const nome = m.pushName || 'Usuário';
      const fotoUrl = await sock.profilePictureUrl(m.sender, 'image').catch(() => null);

      // Cria a imagem de fundo
      const img = new Jimp(512, 512, '#1a1a1a');
      const font = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);

      // Se tiver foto, insere no centro superior
      if (fotoUrl) {
        const avatar = await Jimp.read(fotoUrl);
        avatar.resize(200, 200);
        img.composite(avatar, 156, 80); // Posição centralizada
      }

      // Escreve o nome do usuário
      img.print(font, 0, 300, {
        text: nome,
        alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER
      }, 512, 50);

      // Envia imagem no chat
      const buffer = await img.getBufferAsync(Jimp.MIME_JPEG);
      await sock.sendMessage(m.chat, {
        image: buffer,
        caption: `🪪 Perfil de ${nome}`
      }, { quoted: m });

    } catch (err) {
      console.error('Erro no comando /perfil:', err);
      await sock.sendMessage(m.chat, { text: '❌ Erro ao gerar perfil.' }, { quoted: m });
    }
  }
};