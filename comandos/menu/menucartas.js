module.exports = {
  comando: 'menucartas',
  descricao: 'Exibe o menu de cartas raras',
  categoria: 'menu',
  exec: async (m, { sock }) => {
    const texto = `
📦 *Menu Cartas Raras*

🃏 *cartasraras* — Lista geral de cartas raras  
📚 *set* — Consultar sets e coleções  
🦊 *raposa* — Mostrar cartas da Raposa  
🦏 *rino* — Mostrar cartas do Rino  
🐯 *tigre* — Mostrar cartas do Tigre

ℹ️ Use os comandos acima para obter mais detalhes.
    `.trim();

    await sock.sendMessage(m.chat, { text: texto }, { quoted: m });
  }
};