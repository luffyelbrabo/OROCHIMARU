const axios = require('axios');
const { rapidApiKey } = require('../../config/settings');

module.exports = {
  comando: 'ig',
  descricao: 'Baixa vídeo do Instagram',
  categoria: 'audio',
  exec: async (m, { sock, args }) => {
    const link = args[0];
    if (!link || !link.includes('instagram.com')) {
      return sock.sendMessage(m.chat, {
        text: '❌ Envie um link válido do Instagram. Exemplo:\nhttps://www.instagram.com/reel/xxxxx',
      }, { quoted: m });
    }

    await sock.sendMessage(m.chat, {
      text: '📥 Buscando o vídeo, aguarde...',
    }, { quoted: m });

    try {
      const response = await axios.get('https://instagram-downloader-download.p.rapidapi.com/index', {
        params: { url: link },
        headers: {
          'X-RapidAPI-Key': rapidApiKey,
          'X-RapidAPI-Host': 'instagram-downloader-download.p.rapidapi.com'
        }
      });

      const videoUrl = response.data?.media;

      if (!videoUrl) {
        return sock.sendMessage(m.chat, {
          text: '❌ Não foi possível obter o vídeo. Tente outro link.'
        }, { quoted: m });
      }

      await sock.sendMessage(m.chat, {
        video: { url: videoUrl },
        caption: '📥 Vídeo baixado diretamente do Instagram.'
      }, { quoted: m });

    } catch (err) {
      console.error('Erro ao baixar vídeo do Instagram:', err);
      await sock.sendMessage(m.chat, {
        text: '❌ Erro ao tentar baixar o vídeo. Verifique o link ou tente mais tarde.'
      }, { quoted: m });
    }
  }
};