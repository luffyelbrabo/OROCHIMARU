module.exports = {
  comando: 'manual',
  descricao: 'Exibe o manual básico do bot',
  categoria: 'especiais',
  exec: async (m, { sock }) => {
    const texto = `
📖 *Manual do OROCHIMARU*

🔹 Comandos úteis:
- *manual* — Exibe este manual
- *menu* — Lista todos os menus disponíveis
- *ping* — Testa a latência do bot
- *setranking* — Cadastra seus pontos no ranking
- *ranking* — Exibe o top 10 do ranking
- *setaniversario* — Salva sua data de aniversário
- *cartasraras* — Lista atualizada de cartas raras
- *giros* — Links de giros do Coin Master

ℹ️ Use sempre o prefixo "*" antes de qualquer comando.
Exemplo: *menu

🤖 Bot em constante atualização. Envie sugestões!
    `;
    await sock.sendMessage(m.chat, { text: texto.trim() }, { quoted: m });
  }
};