const db = require('../../tmp/db');

module.exports = {
  comando: 'aniversário',
  descricao: 'Exibe lista de aniversariantes',
  categoria: 'cadastro',
  exec: async (m, { sock }) => {
    db.all('SELECT nome, data FROM aniversarios ORDER BY data', [], async (err, rows) => {
      if (err) return sock.sendMessage(m.chat, { text: '❌ Erro ao obter aniversários.' }, { quoted: m });

      const texto = rows.map(r => `🎉 ${r.nome} - ${r.data}`).join('\n');
      await sock.sendMessage(m.chat, { text: `🎂 Lista de Aniversariantes:\n\n${texto}` }, { quoted: m });
    });
  }
};
