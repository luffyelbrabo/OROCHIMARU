const axios = require('axios');
const { getLetraScraping } = require('../../lib/scraping/letra');

module.exports = {
  comando: 'letra',
  descricao: 'Buscar letra da música',
  categoria: 'gerais',
  exec: async (m, { sock, args }) => {
    const nome = args.join(' ');
    if (!nome) {
      return sock.sendMessage(m.chat, { text: '❌ Use: *letra nome-da-musica*' }, { quoted: m });
    }

    // Tenta primeiro via scraping (Vagalume)
    const scraping = await getLetraScraping(nome);
    if (scraping) {
      return sock.sendMessage(m.chat, { text: scraping }, { quoted: m });
    }

    // Fallback via API lyrics.ovh
    try {
      const partes = nome.split(' - ');
      const artista = partes[0];
      const musica = partes[1] || partes[0];

      const res = await axios.get(`https://api.lyrics.ovh/v1/${encodeURIComponent(artista)}/${encodeURIComponent(musica)}`);
      const letra = res.data.lyrics;

      if (letra) {
        await sock.sendMessage(m.chat, {
          text: `🎶 *${musica}* - ${artista}\n\n${letra}`
        }, { quoted: m });
      } else {
        throw new Error();
      }
    } catch {
      await sock.sendMessage(m.chat, { text: '❌ Letra não encontrada.' }, { quoted: m });
    }
  }
};