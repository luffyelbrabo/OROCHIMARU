const fs = require('fs');
const path = require('path');

module.exports = {
  comando: 'tier',
  descricao: 'Exibe lista de tier',
  categoria: 'coinmaster',
  exec: async (m, { sock }) => {
    const dados = fs.readFileSync(path.join(__dirname, '../../lib/dados/tier.json'), 'utf8');
    const tiers = JSON.parse(dados);

    let resposta = '📊 *Tiers Coin Master:*\n\n';
    tiers.forEach((item, i) => {
      resposta += `${i + 1}. ${item.nome} - ${item.nivel}\n`;
    });

    await sock.sendMessage(m.chat, { text: resposta }, { quoted: m });
  }
};