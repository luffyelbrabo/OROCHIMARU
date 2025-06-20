const axios = require('axios');

module.exports = {
  comando: 'letra',
  descricao: 'Buscar letra da música',
  categoria: 'gerais',
  exec: async (m, { sock, args }) => {
    const input = args.join(' ');
    if (!input) {
      return sock.sendMessage(m.chat, { text: '❌ Use: *letra artista - música*' }, { quoted: m });
    }

    const [artista, musica] = input.includes(' - ')
      ? input.split(' - ')
      : [input, input];

    try {
      const url = `https://api.lyrics.ovh/v1/${encodeURIComponent(artista.trim())}/${encodeURIComponent(musica.trim())}`;
      const res = await axios.get(url);

      const letra = res.data.lyrics || '❌ Letra não encontrada.';
      await sock.sendMessage(m.chat, { text: `🎶 *Letra de ${musica.trim()} – ${artista.trim()}*:\n\n${letra}` }, { quoted: m });
    } catch (err) {
      await sock.sendMessage(m.chat, { text: '❌ Letra não encontrada ou erro na API.' }, { quoted: m });
    }
  }
};