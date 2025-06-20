const fs = require('fs');
const path = require('path');

const arquivo = path.join(__dirname, '../../lib/bingo.json');

module.exports = {
  comando: 'gbingo',
  descricao: 'Gerar números de bingo',
  categoria: 'gerais',
  exec: async (m, { sock }) => {
    const numeros = Array.from({ length: 75 }, (_, i) => i + 1).sort(() => Math.random() - 0.5);
    fs.writeFileSync(arquivo, JSON.stringify({ numeros, sorteados: [] }, null, 2));

    await sock.sendMessage(m.chat, {
      text: '🔢 Números de bingo gerados com sucesso!'
    }, { quoted: m });
  }
};