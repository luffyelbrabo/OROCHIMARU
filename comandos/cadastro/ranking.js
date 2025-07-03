const db = require('../../tmp/db');

module.exports = {
  comando: 'ranking',
  descricao: 'Exibe o ranking de vila (sem marcação)',
  categoria: 'cadastro',
  exec: async (m, { sock }) => {
    try {
      db.all(
        'SELECT nome, pontos FROM ranking ORDER BY pontos DESC LIMIT 100',
        [],
        async (err, rows) => {
          if (err) {
            console.error('Erro no SELECT do ranking:', err);
            return sock.sendMessage(m.chat, {
              text: '❌ Erro ao carregar o ranking.'
            }, { quoted: m });
          }

          if (!rows || rows.length === 0) {
            return sock.sendMessage(m.chat, {
              text: 'ℹ️ Nenhuma vila cadastrada no ranking ainda.'
            }, { quoted: m });
          }

          const texto = rows.map((r, i) => {
            const medalha = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '';
            return `${i + 1}. ${r.nome} - ${r.pontos} ${medalha}`;
          }).join('\n');

          await sock.sendMessage(m.chat, {
            text: `🏆 *Ranking de Vila*\n\n${texto}`
          }, { quoted: m });
        }
      );
    } catch (e) {
      console.error('Erro no comando ranking:', e);
      await sock.sendMessage(m.chat, { text: '❌ Ocorreu um erro ao exibir o ranking.' }, { quoted: m });
    }
  }
};
