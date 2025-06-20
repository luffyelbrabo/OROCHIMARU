const fs = require('fs');
const path = require('path');
const arquivo = path.join(__dirname, '../../lib/bingo.json');

module.exports = {
  comando: 'iniciarbingo',
  descricao: 'Inicia um novo bingo usando os números já gerados',
  categoria: 'gerais',
  exec: async (m, { sock }) => {
    if (!fs.existsSync(arquivo)) {
      return sock.sendMessage(m.chat, { text: '❌ Gere os números primeiro com *gbingo*' }, { quoted: m });
    }

    const dados = JSON.parse(fs.readFileSync(arquivo));
    dados.sorteados = []; // Limpa os números já sorteados
    fs.writeFileSync(arquivo, JSON.stringify(dados, null, 2));

    await sock.sendMessage(m.chat, { text: '🎉 Novo bingo iniciado! Os números serão sorteados a partir de agora.' }, { quoted: m });
  }
};