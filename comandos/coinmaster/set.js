const { getListaSets } = require('../../lib/scraping/set');

module.exports = {
  comando: 'set',
  descricao: 'Lista de sets de cartas atualizada',
  categoria: 'coinmaster',
  exec: async (m, { sock }) => {
    const sets = await getListaSets();

    const resposta = sets.length
      ? sets.map((set, i) => `📦 ${i + 1}. ${set}`).join('\n')
      : '❌ Nenhum set encontrado no momento.';

    await sock.sendMessage(m.chat, { text: `🗂️ *Lista de Sets:*\n\n${resposta}` }, { quoted: m });
  }
};