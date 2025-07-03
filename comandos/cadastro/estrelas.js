// OROCHIMARU/comandos/cadastro/estrelas.js
const db = require('../../tmp/db');

module.exports = {
  comando: 'estrelas',
  descricao: 'Exibe ranking de estrelas',
  categoria: 'cadastro',
  exec: async (m, { sock }) => {
    db.all('SELECT nome, estrelas FROM estrelas ORDER BY estrelas DESC LIMIT 10', [], async (err, rows) => {
      if (err) {
        console.error('Erro ao obter dados de estrelas:', err.message);
        return sock.sendMessage(m.key.remoteJid, { text: '❌ Erro ao obter dados de estrelas.' }, { quoted: m });
      }

      if (!rows || rows.length === 0) {
        return sock.sendMessage(m.key.remoteJid, { text: '⭐ Nenhuma estrela cadastrada ainda.' }, { quoted: m });
      }

      const texto = rows.map((r, i) => `${i + 1}. ${r.nome} - ${r.estrelas} ⭐`).join('\n');
      await sock.sendMessage(m.key.remoteJid, { text: `⭐ *Top 10 Estrelas:*\n\n${texto}` }, { quoted: m });
    });
  }
};
