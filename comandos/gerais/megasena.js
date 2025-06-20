module.exports = {
  comando: 'megasena',
  descricao: 'Gera números aleatórios para aposta da Mega-Sena',
  categoria: 'gerais',

  exec: async (m, { sock }) => {
    const numeros = new Set();

    // Gera 6 números únicos entre 1 e 60
    while (numeros.size < 6) {
      numeros.add(Math.floor(Math.random() * 60) + 1);
    }

    const resultado = [...numeros].sort((a, b) => a - b).join(' - ');

    await sock.sendMessage(m.chat, {
      text: `🎰 *Números da Mega-Sena:*\n\n${resultado}`
    }, { quoted: m });
  }
};