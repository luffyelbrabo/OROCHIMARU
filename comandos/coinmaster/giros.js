const { getLinksGiros } = require('../../lib/scraping/giros');

module.exports = {
  comando: 'giros',
  descricao: 'Exibe links atualizados de giros Coin Master',
  categoria: 'coinmaster',
  exec: async (m, { sock }) => {
    const links = await getLinksGiros();

    const texto = links.length
      ? `🎰 *Links de Giros Coin Master:*\n\n${links.map((l, i) => `🎁 ${l}`).join('\n\n')}\n\n🗓 *Atualizado diariamente*\n⚠️ Use com moderação para evitar bloqueio.`
      : '⚠️ Nenhum link de giro disponível no momento.';

    await sock.sendMessage(m.chat, { text: texto }, { quoted: m });
  }
};