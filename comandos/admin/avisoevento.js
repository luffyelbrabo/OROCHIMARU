module.exports = {
  comando: 'avisoevento',
  descricao: 'Envia aviso de evento em tempo real',
  categoria: 'admin',
  exec: async (m, { sock, args, isGroupAdmin }) => {
    if (!m.isGroup) {
      return sock.sendMessage(m.chat, { text: '❌ Este comando só pode ser usado em grupos.' }, { quoted: m });
    }

    if (!isGroupAdmin) {
      return sock.sendMessage(m.chat, { text: '❌ Apenas admins podem enviar avisos de evento.' }, { quoted: m });
    }

    const aviso = args.join(' ');
    if (!aviso) {
      return sock.sendMessage(m.chat, { text: '❌ Use: *avisoevento Texto do aviso*' }, { quoted: m });
    }

    await sock.sendMessage(m.chat, {
      text: `📢 AVISO DE EVENTO:\n\n${aviso}`
    }, { quoted: m });
  }
};