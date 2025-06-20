// 📄 OROCHIMARU/comandos/cadastro/setranking.js

const db = require('../../lib/db');
const moment = require('moment');

module.exports = {
  comando: 'setranking',
  descricao: 'Cadastrar a vila atual no ranking com data',
  categoria: 'cadastro',
  exec: async (m, { sock, args }) => {
    const [vila] = args;
    const numero = m.sender;
    const nome = m.pushName;
    const data = moment().format('YYYY-MM-DD');

    if (!vila || isNaN(vila)) {
      return sock.sendMessage(m.chat, { text: '❌ Use: *setranking 312*' }, { quoted: m });
    }

    db.run(
      'INSERT INTO ranking (numero, nome, pontos, data_atualizacao) VALUES (?, ?, ?, ?) ON CONFLICT(numero) DO UPDATE SET pontos = ?, data_atualizacao = ?',
      [numero, nome, vila, data, vila, data],
      (err) => {
        if (err) {
          return sock.sendMessage(m.chat, { text: '❌ Erro ao cadastrar a vila no ranking.' }, { quoted: m });
        }

        sock.sendMessage(m.chat, { text: `✅ ${nome} agora está na vila ${vila}.` }, { quoted: m });
      }
    );
  }
};