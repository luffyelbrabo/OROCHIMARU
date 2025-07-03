// 📄 OROCHIMARU/comandos/coinmaster/pp.js

const db = require('../../tmp/db');

module.exports = {
  comando: 'pp',
  descricao: 'Exibe quem ainda não cadastrou a vila',
  categoria: 'coinmaster',
  exec: async (m, { sock }) => {
    try {
      const groupJid = m.key.remoteJid;

      if (!groupJid || !groupJid.endsWith('@g.us')) {
        return await sock.sendMessage(groupJid || m.key.participant, {
          text: '❌ Este comando só pode ser usado em grupos.'
        }, { quoted: m });
      }

      // Pega todos os membros do grupo
      const metadata = await sock.groupMetadata(groupJid);
      const membrosGrupo = metadata.participants.map(p => p.id);

      // Consulta todos que já cadastraram vila
      const rows = await new Promise((resolve, reject) => {
        db.all('SELECT numero FROM ranking', [], (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        });
      });

      const cadastrados = rows.map(r => r.numero.replace(/\D/g, ''));

      // Filtra membros não cadastrados
      const naoCadastrados = membrosGrupo.filter(id => {
        const numero = id.split('@')[0].replace(/\D/g, '');
        return !cadastrados.includes(numero);
      });

      if (naoCadastrados.length === 0) {
        return await sock.sendMessage(groupJid, {
          text: '✅ Todos os membros já cadastraram suas vilas!'
        }, { quoted: m });
      }

      const texto = `⚠️ *Atenção!!*\n\nNão esqueçam de enviar seu *nome e número da vila* com o comando:\n\n*setranking nome:vila*\n*setranking Maicon Oliveira:300*\n\nMembros que ainda não se cadastraram:\n\n${naoCadastrados.map((n, i) => `${i + 1}. @${n.split('@')[0]}`).join('\n')}`;

      await sock.sendMessage(groupJid, {
        text: texto,
        mentions: naoCadastrados
      }, { quoted: m });

    } catch (e) {
      console.error('❌ Erro no comando pp:', e);
      await sock.sendMessage(m.key.remoteJid, {
        text: '❌ Ocorreu um erro ao verificar os cadastros.'
      }, { quoted: m });
    }
  }
};
