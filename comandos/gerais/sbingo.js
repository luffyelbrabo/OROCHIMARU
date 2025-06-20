const fs = require('fs');
const path = require('path');

const arquivo = path.join(__dirname, '../../lib/bingo.json');

module.exports = {
  comando: 'sbingo',
  descricao: 'Sortear próximo número do bingo',
  categoria: 'gerais',
  exec: async (m, { sock }) => {
    if (!fs.existsSync(arquivo)) {
      return sock.sendMessage(m.chat, {
        text: '❌ O bingo ainda não foi iniciado. Use *gbingo* para começar.'
      }, { quoted: m });
    }

    const dados = JSON.parse(fs.readFileSync(arquivo));
    const proximo = dados.numeros.find(n => !dados.sorteados.includes(n));

    if (!proximo) {
      return sock.sendMessage(m.chat, {
        text: '✅ Todos os números já foram sorteados!'
      }, { quoted: m });
    }

    dados.sorteados.push(proximo);
    fs.writeFileSync(arquivo, JSON.stringify(dados, null, 2));

    await sock.sendMessage(m.chat, {
      text: `🎱 Número sorteado: *${proximo}*`
    }, { quoted: m });
  }
};