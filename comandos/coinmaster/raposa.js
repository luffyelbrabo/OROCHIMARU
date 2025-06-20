module.exports = {
  comando: 'raposa',
  descricao: 'Informações sobre a Raposa',
  categoria: 'coinmaster',
  exec: async (m, { sock }) => {
    const texto = `
🦊 *Raposa*:

A Raposa é usada para invadir as vilas.  
Quanto mais evoluída, mais alto o valor da invasão.

Use ração para evoluir sua Raposa.  
*Nível máximo: 5*
    `;
    await sock.sendMessage(m.chat, { text: texto }, { quoted: m });
  }
};