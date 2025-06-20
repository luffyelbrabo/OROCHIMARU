const fs = require('fs');
const path = require('path');
const arquivo = path.join(__dirname, '../../lib/bingo.json');

module.exports = {
  comando: 'sortearbingo',
  descricao: 'Sortear número do bingo',
  categoria: 'gerais',
  exec: async (m, { sock }) => {
    if (!fs.existsSync(arquivo)) return sock.sendMessage(m.chat, { text: '❌ Inicie o bingo com *iniciarbingo*' }, { quoted: m });

    const dados = JSON.parse(fs.readFileSync(arquivo));
    const restantes = dados.numeros.filter(n => !dados.sorteados.includes(n));

    if (restantes.length === 0) return sock.sendMessage(m.chat, { text: '✅ Todos os números já foram sorteados!' }, { quoted: m });

    const sorteado = restantes[Math.floor(Math.random() * restantes.length)];
    dados.sorteados.push(sorteado);

    fs.writeFileSync(arquivo, JSON.stringify(dados));

    await sock.sendMessage(m.chat, { text: `🟡 Número sorteado: *${sorteado}*` }, { quoted: m });
  }
};