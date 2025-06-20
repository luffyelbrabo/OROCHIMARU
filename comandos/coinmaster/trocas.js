const { getTrocas } = require('../../lib/scraping/trocas');

module.exports = {
  comando: 'trocas',
  descricao: 'Verifica trocas de cartas disponíveis',
  categoria: 'coinmaster',
  exec: async (m, { sock }) => {
    const trocas = await getTrocas();

    const texto = trocas.length
      ? trocas.map((t, i) => `♻️ ${i + 1}. ${t}`).join('\n')
      : '❌ Nenhuma troca disponível no momento.';

    await sock.sendMessage(m.chat, { text: `🔁 *Trocas de Cartas:*\n\n${texto}` }, { quoted: m });
  }
};