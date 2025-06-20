module.exports = {
  comando: 'tigre',
  descricao: 'Informações sobre o Tigre',
  categoria: 'coinmaster',
  exec: async (m, { sock }) => {
    const texto = `
🐯 *Tigre*:

O Tigre aumenta o dano nos ataques.  
Muito útil para ganhar mais moedas.

*Nível máximo: 5*  
Recomenda-se usá-lo durante eventos de ataque.
    `;
    await sock.sendMessage(m.chat, { text: texto }, { quoted: m });
  }
};