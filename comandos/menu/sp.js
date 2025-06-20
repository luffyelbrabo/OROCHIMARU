module.exports = {
  comando: 'sp',
  descricao: 'Exibe os comandos de aceleradores',
  categoria: 'menu',
  exec: async (m, { sock }) => {
    const texto = `
🚀 Menu de Aceleradores:

- *giros
- *girospet
- *media
- *sequencia
- *rase

Use o comando desejado para ver mais detalhes.
    `;
    await sock.sendMessage(m.chat, { text: texto }, { quoted: m });
  }
};