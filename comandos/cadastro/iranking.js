const db = require('../../tmp/db');

module.exports = { comando: 'iranking', descricao: 'Exibe ranking com marcação', categoria: 'cadastro', exec: async (m, { sock }) => { try { const metadata = await sock.groupMetadata(m.chat); const participantes = metadata.participants;

db.all(
    'SELECT nome, pontos, numero FROM ranking ORDER BY pontos DESC LIMIT 100',
    [],
    async (err, rows) => {
      if (err) {
        return sock.sendMessage(m.chat, {
          text: '❌ Erro ao carregar ranking.',
        }, { quoted: m });
      }

      const texto = rows.map((r, i) => {
        const numero = r.numero.replace(/[^0-9]/g, '');
        const participante = participantes.find(p => p.id.includes(numero));
        const nomeContato = participante?.notify || participante?.vname || participante?.name || `wa.me/${numero}`;
        const medalha = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '';
        return `${i + 1}. ${r.nome} - ${r.pontos}${medalha ? ` ${medalha}` : ''} - @${numero}`;
      }).join('\n');

      const mentions = rows.map(r => r.numero.replace(/\D/g, '') + '@s.whatsapp.net');

      await sock.sendMessage(m.chat, {
        text: `🏆 *Ranking de vila do Grupo com ID:*

${texto}`, mentions: mentions }, { quoted: m }); } ); } catch (e) { console.error('Erro no comando iranking:', e); await sock.sendMessage(m.chat, { text: '❌ Ocorreu um erro ao processar o ranking.' }, { quoted: m }); } } };
