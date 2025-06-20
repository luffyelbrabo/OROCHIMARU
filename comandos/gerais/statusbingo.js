const fs = require('fs');
const path = require('path');
const arquivo = path.join(__dirname, '../../lib/bingo.json');

module.exports = {
  comando: 'statusbingo',
  descricao: 'Ver status do bingo',
  categoria: 'gerais',
  exec: async (m, { sock }) => {
    if (!fs.existsSync(arquivo)) {
      return sock.sendMessage(m.chat, { text: '❌ Nenhum bingo iniciado.' }, { quoted: m });
    }

    const dados = JSON.parse(fs.readFileSync(arquivo));
    const texto = dados.sorteados.length > 0
      ? dados.sorteados.map(n => `🔢 ${n}`).join(', ')
      : 'Nenhum número ainda.';

    await sock.sendMessage(m.chat, { text: `📊 *Números sorteados até agora:*\n\n${texto}` }, { quoted: m });
  }
};