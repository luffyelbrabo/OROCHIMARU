const fs = require('fs'); const path = require('path');

module.exports = { comando: 'menutier', descricao: 'Exibe o menu tier do jogo com tabelas', categoria: 'menu', exec: async (m, { sock }) => { const imagem1 = fs.readFileSync(path.join(__dirname, '../../lib/assets/evento_10_pontos.jpg')); const imagem2 = fs.readFileSync(path.join(__dirname, '../../lib/assets/evento_misto_porco.jpg'));

await sock.sendMessage(m.chat, {
  image: imagem1,
  caption: '📊 *Tabela Evento 10 Pontos*'
}, { quoted: m });

await sock.sendMessage(m.chat, {
  image: imagem2,
  caption: '🐷 *Tabela Evento Misto/Porco*'
}, { quoted: m });

} };

