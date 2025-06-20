module.exports = {
  comando: 'ping',
  descricao: 'Testar a latência do bot',
  categoria: 'gerais',

  exec: async (m, { sock }) => {
    const inicio = Date.now();

    // Envia uma mensagem inicial
    await sock.sendMessage(m.chat, { text: '🏓 Pingando...' }, { quoted: m });

    // Calcula a latência
    const latencia = Date.now() - inicio;

    // Envia o resultado
    await sock.sendMessage(m.chat, {
      text: `✅ Pong! Latência: ${latencia}ms`
    }, { quoted: m });
  }
};