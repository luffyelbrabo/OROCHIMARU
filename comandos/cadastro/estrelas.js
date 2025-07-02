const db = require('../../tmp/db');

module.exports = {
  comando: 'estrelas',
  descricao: 'Exibe ranking de estrelas',
  categoria: 'cadastro',
  exec: async (m, { sock }) => {
    db.all('SELECT nome, estrelas FROM estrelas ORDER BY estrelas DESC LIMIT 10', [], async (err, rows) => {
      if (err) return sock.sendMessage(m.chat, { text: '❌ Erro ao obter dados de estrelas.' }, { quoted: m });

      const texto = rows.map((r, i) => `${i + 1}. ${r.nome} - ${r.estrelas} ⭐`).join('\n');
      await sock.sendMessage(m.chat, { text: `⭐ Top 10 Estrelas:\n\n${texto}` }, { quoted: m });
    });
  }
};
