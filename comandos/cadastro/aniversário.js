// OROCHIMARU/comandos/cadastro/aniversario.js
const db = require('../../tmp/db');

module.exports = {
  comando: 'aniversario',
  descricao: 'Exibe lista de aniversariantes',
  categoria: 'cadastro',
  exec: async (m, { sock }) => {
    db.all('SELECT nome, data FROM aniversarios ORDER BY data', [], async (err, rows) => {
      if (err) {
        console.error('Erro ao obter aniversários:', err.message);
        return sock.sendMessage(m.key.remoteJid, { text: '❌ Erro ao obter aniversários.' }, { quoted: m });
      }

      if (!rows || rows.length === 0) {
        return sock.sendMessage(m.key.remoteJid, { text: '🎂 Nenhum aniversário cadastrado ainda.' }, { quoted: m });
      }

      const texto = rows.map(r => `🎉 ${r.nome} - ${r.data}`).join('\n');
      await sock.sendMessage(m.key.remoteJid, { text: `🎂 *Lista de Aniversariantes:*\n\n${texto}` }, { quoted: m });
    });
  }
};
