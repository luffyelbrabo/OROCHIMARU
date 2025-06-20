const fs = require('fs');
const path = require('path');

const arquivo = path.join(__dirname, '../../lib/bingo.json');

module.exports = {
  comando: 'fbingo',
  descricao: 'Finaliza o jogo de bingo (remove os dados)',
  categoria: 'gerais',
  exec: async (m, { sock }) => {
    if (!fs.existsSync(arquivo)) {
      return sock.sendMessage(m.chat, {
        text: '⚠️ Nenhum bingo em andamento para finalizar.'
      }, { quoted: m });
    }

    fs.unlinkSync(arquivo);

    await sock.sendMessage(m.chat, {
      text: '🧹 Bingo finalizado e dados removidos com sucesso!'
    }, { quoted: m });
  }
};