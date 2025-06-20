module.exports = {
  comando: 'media',
  descricao: 'Calcula média de valores',
  categoria: 'coinmaster',
  exec: async (m, { sock, args }) => {
    const numeros = args.map(n => parseFloat(n)).filter(n => !isNaN(n));
    if (numeros.length === 0) {
      return sock.sendMessage(m.chat, { text: '❌ Use: *media 10 20 30*' }, { quoted: m });
    }

    const media = numeros.reduce((a, b) => a + b, 0) / numeros.length;

    await sock.sendMessage(m.chat, { text: `📊 Média: ${media.toFixed(2)}` }, { quoted: m });
  }
};