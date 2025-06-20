module.exports = {
  comando: 'sair',
  descricao: 'Silencia notificações do bot para você',
  categoria: 'especiais',
  exec: async (m, { sock }) => {
    const texto = `
🔕 *Notificações desativadas*

Você optou por não receber mensagens do bot.

Para reativar, fale com o administrador ou envie: *reativar*
    `;

    await sock.sendMessage(m.chat, { text: texto.trim() }, { quoted: m });

    // 💡 Implementação futura: salvar no banco quem desativou notificações
    // const numero = m.sender;
    // db.run('INSERT OR REPLACE INTO silenciados (numero, status) VALUES (?, ?)', [numero, true]);
  }
};