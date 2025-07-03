const { getLinksGiros } = require('../../lib/scraping/giros');
const axios = require('axios'); // Para salvar no seu backend Render

module.exports = {
  comando: 'giros',
  descricao: 'Exibe links atualizados de giros Coin Master com links personalizados',
  categoria: 'coinmaster',
  exec: async (m, { sock }) => {
    const links = await getLinksGiros();

    if (!links.length) {
      await sock.sendMessage(m.chat, { text: '⚠️ Nenhum link de giro disponível no momento.' }, { quoted: m });
      return;
    }

    // Gerar códigos personalizados e salvar no backend
    const baseRedirect = 'https://orochimaru-bv2e.onrender.com/';
    let resposta = '🎰 *Links de Giros Coin Master:*\n\n';

    for (const link of links) {
      // Solicita ao seu backend gerar um código
      try {
        const res = await axios.post(`${baseRedirect}api/salvar`, { link });
        const code = res.data.code; // Exemplo: 192, sk9

        resposta += `🎁 ${baseRedirect}${code}\n\n`;
      } catch (err) {
        resposta += `⚠️ Erro ao gerar link para: ${link}\n\n`;
      }
    }

    resposta += '🗓 *Atualizado diariamente*\n⚠️ Use com moderação para evitar bloqueio.';

    await sock.sendMessage(m.chat, { text: resposta }, { quoted: m });
  }
};
