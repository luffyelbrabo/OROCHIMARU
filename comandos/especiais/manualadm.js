module.exports = {
  comando: 'manualadm',
  descricao: 'Exibe o manual do administrador',
  categoria: 'especiais',
  exec: async (m, { sock }) => {
    const texto = `
🔐 *Manual do Administrador do OROCHIMARU*

Comandos disponíveis para administradores:

- *ban @user* — Bane o usuário mencionado
- *unban número* — Remove o banimento do número informado
- *setregras texto* — Define as regras do grupo
- *abrir* / *fechar* — Controla a entrada de membros
- *welcome on/off* — Ativa ou desativa as boas-vindas
- *zerarmsg* — Zera a contagem de mensagens do grupo

⚠️ Use com responsabilidade. Comandos administrativos podem impactar todo o grupo.
    `;
    await sock.sendMessage(m.chat, { text: texto.trim() }, { quoted: m });
  }
};