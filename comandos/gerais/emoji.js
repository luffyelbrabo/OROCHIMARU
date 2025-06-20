const emoji = require('node-emoji');

module.exports = {
  comando: 'emoji',
  descricao: 'Mostra emoji convertido',
  categoria: 'gerais',
  exec: async (m, { sock, args }) => {
    const nome = args.join(' ').toLowerCase().trim().replace(/\s+/g, '_');
    if (!nome) {
      return sock.sendMessage(m.chat, { text: '❌ Use: *emoji nome-do-emoji*\nEx: *emoji dog*' }, { quoted: m });
    }

    const resultado = emoji.get(nome);

    if (resultado === `:${nome}:`) {
      // Emoji não encontrado, sugerir próximos
      const sugestoes = emoji.search(nome).slice(0, 3);
      const sugestaoTexto = sugestoes.length
        ? sugestoes.map(e => `• ${e.key} → ${emoji.get(e.key)}`).join('\n')
        : 'Nenhum similar encontrado.';

      return sock.sendMessage(m.chat, {
        text: `❌ Emoji *${nome}* não encontrado.\n🔍 Sugestões:\n${sugestaoTexto}`
      }, { quoted: m });
    }

    await sock.sendMessage(m.chat, { text: `🔹 Emoji: ${resultado}` }, { quoted: m });
  }
};