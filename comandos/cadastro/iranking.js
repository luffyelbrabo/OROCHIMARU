// OROCHIMARU/comandos/cadastro/iranking.js
const db = require('../../tmp/db');

module.exports = {
  comando: 'iranking',
  descricao: 'Exibe ranking com marcação',
  categoria: 'cadastro',
  exec: async (m, { sock }) => {
    try {
      const metadata = await sock.groupMetadata(m.key.remoteJid);
      const participantes = metadata.participants;

      db.all(
        'SELECT nome, pontos, numero FROM ranking ORDER BY pontos DESC LIMIT 100',
        [],
        async (err, rows) => {
          if (err) {
            console.error('Erro ao carregar ranking:', err.message);
            return sock.sendMessage(m.key.remoteJid, {
              text: '❌ Erro ao carregar ranking.'
            }, { quoted: m });
          }

          if (!rows || rows.length === 0) {
            return sock.sendMessage(m.key.remoteJid, {
              text: '🏆 Nenhum ranking cadastrado ainda.'
            }, { quoted: m });
          }

          const texto = rows.map((r, i) => {
            const numero = r.numero.replace(/\D/g, '');
            const participante = participantes.find(p => p.id.includes(numero));
            const nomeContato = participante?.notify || participante?.vname || participante?.name || `wa.me/${numero}`;
            const medalha = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '';
            return `${i + 1}. ${r.nome} - ${r.pontos} pontos ${medalha} - @${numero}`;
          }).join('\n');

          const mentions = rows.map(r => r.numero.replace(/\D/g, '') + '@s.whatsapp.net');

          await sock.sendMessage(m.key.remoteJid, {
            text: `🏆 *Ranking de Vila do Grupo:*\n\n${texto}`,
            mentions
          }, { quoted: m });
        }
      );
    } catch (e) {
      console.error('Erro no comando iranking:', e);
      await sock.sendMessage(m.key.remoteJid, {
        text: '❌ Ocorreu um erro ao processar o ranking.'
      }, { quoted: m });
    }
  }
};
