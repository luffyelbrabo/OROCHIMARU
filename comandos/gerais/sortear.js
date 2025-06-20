module.exports = {
  comando: 'sortear',
  descricao: 'Sortear nomes, números ou itens',
  categoria: 'gerais',
  exec: async (m, { sock, args }) => {
    let entrada = args.join(' ').trim();

    // Caso o usuário envie em múltiplas linhas
    if (!entrada && m.quoted && m.quoted.text) {
      entrada = m.quoted.text.trim();
    }

    // Divide por vírgula, nova linha ou espaço
    const itens = entrada
      .split(/[\n,]+|\s{2,}/)
      .map(item => item.trim())
      .filter(item => item.length > 0);

    if (itens.length < 2) {
      return sock.sendMessage(m.chat, { text: '❌ Envie pelo menos dois itens para sortear.' }, { quoted: m });
    }

    const sorteado = itens[Math.floor(Math.random() * itens.length)];
    await sock.sendMessage(m.chat, { text: `🎯 Resultado do sorteio: *${sorteado}*` }, { quoted: m });
  }
};