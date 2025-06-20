const axios = require('axios');
const { rapidApiKey } = require('../../config/settings');

module.exports = {
  comando: 'tiktok',
  descricao: 'Baixa vídeo do TikTok via API',
  categoria: 'audio',
  exec: async (m, { sock, args }) => {
    const link = args[0];
    if (!link || !link.includes('tiktok.com')) {
      return sock.sendMessage(m.chat, {
        text: '❌ Envie um link válido do TikTok. Exemplo:\nhttps://www.tiktok.com/@usuario/video/123456',
      }, { quoted: m });
    }

    await sock.sendMessage(m.chat, {
      text: '📥 Baixando vídeo do TikTok, aguarde...',
    }, { quoted: m });

    try {
      const response = await axios.get('https://tiktok-downloader-download.p.rapidapi.com/media-info/', {
        params: { url: link },
        headers: {
          'X-RapidAPI-Key': rapidApiKey,
          'X-RapidAPI-Host': 'tiktok-downloader-download.p.rapidapi.com'
        }
      });

      const videoUrl = response.data?.video?.url;

      if (!videoUrl) {
        return sock.sendMessage(m.chat, {
          text: '❌ Não foi possível obter o vídeo. Verifique o link e tente novamente.',
        }, { quoted: m });
      }

      await sock.sendMessage(m.chat, {
        video: { url: videoUrl },
        caption: '🎬 Vídeo baixado com sucesso!',
      }, { quoted: m });

    } catch (error) {
      console.error('Erro ao baixar vídeo do TikTok:', error);
      return sock.sendMessage(m.chat, {
        text: '❌ Ocorreu um erro ao tentar baixar o vídeo do TikTok.',
      }, { quoted: m });
    }
  }
};