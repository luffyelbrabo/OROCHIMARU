module.exports = {
  comando: 'top5',
  descricao: 'Exibir 5 membros aleatórios',
  categoria: 'gerais',
  exec: async (m, { sock, participants }) => {
    const membros = participants.filter(p => !p.admin && p.id !== sock.user.id);
    const embaralhado = membros.sort(() => Math.random() - 0.5).slice(0, 5);

    const emojis = ['🥇', '🥈', '🥉', '🏅', '🎖️'];
    const texto = embaralhado.map((m, i) => `${emojis[i]} *${i + 1}. @${m.id.split('@')[0]}*`).join('\n');

    await sock.sendMessage(m.chat, {
      text: `🏆 *Top 5 membros aleatórios:*\n\n${texto}`,
      mentions: embaralhado.map(m => m.id)
    }, { quoted: m });
  }
};