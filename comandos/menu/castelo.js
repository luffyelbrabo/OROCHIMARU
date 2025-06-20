module.exports = {
  comando: 'castelo',
  descricao: 'Exibe o menu de castelos',
  categoria: 'menu',
  exec: async (m, { sock }) => {
    const texto = `
🏰 *Menu Castelo*

🔹 *castelo* — Ver informações do castelo principal  
❄️ *castelogelo* — Ver detalhes do Castelo de Gelo
    `.trim();

    await sock.sendMessage(m.chat, { text: texto }, { quoted: m });
  }
};