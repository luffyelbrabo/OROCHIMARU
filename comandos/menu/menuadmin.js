module.exports = {
  comando: 'menuadmin',
  descricao: 'Exibe o menu de administração',
  categoria: 'menu',
  exec: async (m, { sock }) => {
    const texto = `
🛡️ *Menu Admin*

🔒 *ban* / *unban* — Banir ou desbanir usuários  
🧹 *zerarmsg* — Zera contagem de mensagens  
🔓 *abrir* / *fechar* — Abrir ou fechar o grupo  
🔗 *linkgrupo* — Mostrar link do grupo  
📜 *regras* / *setregras* — Exibir ou definir regras  
👋 *welcome on/off* — Ativa/desativa boas-vindas  
📉 *inativos* — Lista membros inativos  
🎯 *mododinamica* — Ativa modo dinâmico  
🚫 *listabanidos* — Lista de banidos  
📢 *avisoevento* — Enviar aviso de evento

⚠️ *Apenas administradores podem usar esses comandos.*
    `.trim();

    await sock.sendMessage(m.chat, { text: texto }, { quoted: m });
  }
};