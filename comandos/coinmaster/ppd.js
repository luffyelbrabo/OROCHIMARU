const db = require('../../tmp/db');
const moment = require('moment'); // já incluso no package.json

module.exports = {
  comando: 'ppd',
  descricao: 'Filtra quem não atualizou a vila recentemente',
  categoria: 'coinmaster',
  exec: async (m, { sock }) => {
    const diasLimite = 3; // Altere se quiser considerar outro intervalo
    const hoje = moment();

    db.all('SELECT nome, numero, data_atualizacao FROM ranking', [], async (err, rows) => {
      if (err) {
        return sock.sendMessage(m.chat, { text: '❌ Erro ao verificar atualizações.' }, { quoted: m });
      }

      const desatualizados = rows.filter(row => {
        if (!row.data_atualizacao) return true;

        const data = moment(row.data_atualizacao, 'DD/MM');
        if (!data.isValid()) return true;

        // Ajustar ano da data para fazer a comparação correta
        data.year(hoje.year());
        if (data.isAfter(hoje)) data.subtract(1, 'year'); // Trata virada de ano

        const diffDias = hoje.diff(data, 'days');
        return diffDias > diasLimite;
      });

      if (desatualizados.length === 0) {
        return sock.sendMessage(m.chat, { text: '✅ Todos atualizaram recentemente sua vila!' }, { quoted: m });
      }

      const texto = desatualizados.map((u, i) => {
        const data = u.data_atualizacao || 'sem registro';
        return `${i + 1}. ${u.nome} - Última: ${data}`;
      }).join('\n');

      await sock.sendMessage(m.chat, {
        text: `⚠️ *Membros que não atualizaram a vila há mais de ${diasLimite} dias:*\n\n${texto}`,
      }, { quoted: m });
    });
  }
};
