const { getLinksGiros } = require('../../lib/scraping/giros');
const axios = require('axios');

module.exports = {
  comando: 'giros',
  descricao: 'Exibe links atualizados de giros Coin Master com data de postagem e redirecionamento personalizado',
  categoria: 'coinmaster',
  exec: async (m, { sock }) => {
    const links = await getLinksGiros();

    if (!links.length) {
      await sock.sendMessage(m.chat, {
        text: '⚠️ Nenhum link de giro disponível no momento.'
      }, { quoted: m });
      return;
    }

    const baseRedirect = 'https://orochimaru-bv2e.onrender.com/';
    let resposta = '🎰 *Links de Giros Coin Master:*\n\n';

    for (const { url, dataHora } of links) {
      try {
        const res = await axios.post(`${baseRedirect}api/salvar`, { link: url });
        const code = res.data.code;

        resposta += `🎁 ${baseRedirect}${code}\n📅 Postado em: ${dataHora}\n\n`;
      } catch (err) {
        resposta += `⚠️ Erro ao gerar link para: ${url}\n\n`;
      }
    }

    resposta += '🗓 *Atualizado diariamente*\n⚠️ Use com moderação para evitar bloqueio.';

    await sock.sendMessage(m.chat, { text: resposta }, { quoted: m });
  }
};
