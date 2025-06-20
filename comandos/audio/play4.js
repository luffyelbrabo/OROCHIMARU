const axios = require('axios');
const { rapidApiKey } = require('../../config/settings');

module.exports = {
  comando: 'play4',
  descricao: 'Baixa música alternativa do YouTube usando API',
  categoria: 'audio',
  exec: async (m, { sock, args }) => {
    if (!args || args.length === 0) {
      return sock.sendMessage(m.chat, {
        text: '❌ Informe o nome ou link da música.',
      }, { quoted: m });
    }

    const query = args.join(' ');

    await sock.sendMessage(m.chat, {
      text: '🔎 Buscando música na API alternativa, aguarde...',
    }, { quoted: m });

    try {
      const response = await axios.get('https://youtube-music1.p.rapidapi.com/v2/search', {
        params: { query },
        headers: {
          'X-RapidAPI-Key': rapidApiKey,
          'X-RapidAPI-Host': 'youtube-music1.p.rapidapi.com'
        }
      });

      const results = response.data?.result?.songs;
      if (!results || results.length === 0) {
        return sock.sendMessage(m.chat, {
          text: '❌ Nenhuma música encontrada na API.',
        }, { quoted: m });
      }

      const song = results[0];
      const audioUrl = song.url; // Ou song.audioUrl, dependendo da API

      if (!audioUrl) {
        return sock.sendMessage(m.chat, {
          text: '❌ Não foi possível obter o link do áudio.',
        }, { quoted: m });
      }

      await sock.sendMessage(m.chat, {
        audio: { url: audioUrl },
        mimetype: 'audio/mpeg',
        ptt: false,
        caption: `🎵 ${song.title} - ${song.artist.name}`
      }, { quoted: m });

    } catch (error) {
      console.error('Erro na API alternativa:', error);
      await sock.sendMessage(m.chat, {
        text: '❌ Erro ao buscar a música na API alternativa.',
      }, { quoted: m });
    }
  }
};