// 📄 OROCHIMARU/comandos/cadastro/setranking.js
const db = require('../../tmp/db');
const moment = require('moment');

module.exports = {
  comando: 'setranking',
  descricao: 'Cadastrar a vila atual no ranking com data',
  categoria: 'cadastro',
  exec: async (m, { sock }) => {
    const body = m.message.conversation || m.message.extendedTextMessage?.text || '';
    const args = body.trim().split(/\s+/).slice(1);
    const [vila] = args;

    const numero = m.key.participant || m.key.remoteJid;
    const nome = m.pushName;
    const data = moment().format('YYYY-MM-DD');

    if (!vila || isNaN(vila)) {
      return sock.sendMessage(m.key.remoteJid, {
        text: '❌ Use: *setranking 312*'
      }, { quoted: m });
    }

    db.run(
      `INSERT INTO ranking (numero, nome, pontos, data_atualizacao) 
       VALUES (?, ?, ?, ?)
       ON CONFLICT(numero) DO UPDATE SET pontos = excluded.pontos, data_atualizacao = excluded.data_atualizacao`,
      [numero, nome, vila, data],
      (err) => {
        if (err) {
          console.error('Erro no setranking:', err.message);
          return sock.sendMessage(m.key.remoteJid, {
            text: '❌ Erro ao cadastrar a vila no ranking.'
          }, { quoted: m });
        }

        sock.sendMessage(m.key.remoteJid, {
          text: `✅ ${nome} agora está na vila ${vila}.`
        }, { quoted: m });
      }
    );
  }
};
