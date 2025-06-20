const ytdl = require('ytdl-core');
const yts = require('yt-search');
const fs = require('fs');
const path = require('path');

module.exports = {
  comando: 'play',
  descricao: 'Baixa música do YouTube por nome ou link',
  categoria: 'audio',
  exec: async (m, { sock, args }) => {
    if (!args || args.length === 0) {
      return sock.sendMessage(m.chat, {
        text: '❌ Informe o nome ou link da música.',
      }, { quoted: m });
    }

    const query = args.join(' ');
    const { videos } = await yts(query);
    const video = videos[0];

    if (!video) {
      return sock.sendMessage(m.chat, {
        text: '❌ Música não encontrada.',
      }, { quoted: m });
    }

    const filePath = path.resolve(__dirname, '../../temp/audio.mp3');

    try {
      const stream = ytdl(video.url, { filter: 'audioonly' });
      const writeStream = fs.createWriteStream(filePath);

      stream.pipe(writeStream);

      writeStream.on('finish', async () => {
        await sock.sendMessage(m.chat, {
          audio: { url: filePath },
          mimetype: 'audio/mp4',
          ptt: false
        }, { quoted: m });

        fs.unlinkSync(filePath); // Limpa o arquivo após envio
      });

      stream.on('error', (err) => {
        console.error('Erro no stream:', err);
        sock.sendMessage(m.chat, {
          text: '❌ Erro ao baixar o áudio.',
        }, { quoted: m });
      });

    } catch (err) {
      console.error('Erro geral:', err);
      return sock.sendMessage(m.chat, {
        text: '❌ Ocorreu um erro ao tentar baixar a música.',
      }, { quoted: m });
    }
  }
};