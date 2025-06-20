module.exports = {
  comando: 'sorteio',
  descricao: 'Sortear um membro aleatório',
  categoria: 'gerais',
  exec: async (m, { sock, participants }) => {
    const membros = participants.filter(p => !p.admin && p.id !== sock.user.id);
    const sorteado = membros[Math.floor(Math.random() * membros.length)];

    await sock.sendMessage(m.chat, {
      text: `🎉 O sorteado foi: @${sorteado.id.split('@')[0]}`,
      mentions: [sorteado.id]
    }, { quoted: m });
  }
};