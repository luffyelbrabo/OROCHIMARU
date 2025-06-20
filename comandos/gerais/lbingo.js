const fs = require('fs');
const path = require('path');

const arquivo = path.join(__dirname, '../../lib/bingo.json');

module.exports = {
  comando: 'lbingo',
  descricao: 'Listar números de bingo sorteados',
  categoria: 'gerais',
  exec: async (m, { sock }) => {
    if (!fs.existsSync(arquivo)) {
      return sock.sendMessage(m.chat, {
        text: '❌ Nenhum bingo foi iniciado. Use *gbingo* para começar.'
      }, { quoted: m });
    }

    const dados = JSON.parse(fs.readFileSync(arquivo));
    const sorteados = dados.sorteados || [];

    const texto = sorteados.length
      ? `🎉 Números sorteados até agora:\n\n${sorteados.join(', ')}`
      : '📭 Nenhum número foi sorteado ainda.';

    await sock.sendMessage(m.chat, { text: texto }, { quoted: m });
  }
};