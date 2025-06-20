const db = require('../../lib/db');

module.exports = {
  comando: 'pp',
  descricao: 'Exibe quem ainda não cadastrou a vila',
  categoria: 'coinmaster',
  exec: async (m, { sock }) => {
    try {
      // Pega todos os membros do grupo
      const metadata = await sock.groupMetadata(m.chat);
      const membrosGrupo = metadata.participants.map(p => p.id);

      // Consulta todos que já cadastraram vila
      db.all('SELECT numero FROM ranking', [], async (err, rows) => {
        if (err) {
          return sock.sendMessage(m.chat, { text: '❌ Erro ao acessar o ranking.' }, { quoted: m });
        }

        const cadastrados = rows.map(r => r.numero.replace(/\D/g, ''));

        // Filtrar membros não cadastrados
        const naoCadastrados = membrosGrupo.filter(id => {
          const numero = id.split('@')[0].replace(/\D/g, '');
          return !cadastrados.includes(numero);
        });

        if (naoCadastrados.length === 0) {
          return sock.sendMessage(m.chat, { text: '✅ Todos os membros já cadastraram suas vilas!' }, { quoted: m });
        }

        const texto = `⚠️ *Atenção!!*\n\nNão esqueçam de enviar seu *nome e número da vila* com o comando:\n\n*setranking nome:vila*\n*setranking Maicon Oliveira:300*\n\nMembros que ainda não se cadastraram:\n\n${naoCadastrados.map((n, i) => `${i + 1}. @${n.split('@')[0]}`).join('\n')}`;

        await sock.sendMessage(m.chat, {
          text: texto,
          mentions: naoCadastrados
        }, { quoted: m });
      });
    } catch (e) {
      console.error('Erro no comando pp:', e);
      await sock.sendMessage(m.chat, { text: '❌ Ocorreu um erro ao verificar os cadastros.' }, { quoted: m });
    }
  }
};