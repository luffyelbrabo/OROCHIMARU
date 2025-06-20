module.exports = {
  comando: 'rino',
  descricao: 'Informações sobre o Rino',
  categoria: 'coinmaster',
  exec: async (m, { sock }) => {
    const texto = `
🦏 *Rino*:

O Rino é como um escudo extra.  
Ele tem chance de bloquear ataques mesmo sem escudo ativo.

- Raridade: Lendário  
- Nível máximo: 5

Ative-o nas configurações de mascotes.
    `;
    await sock.sendMessage(m.chat, { text: texto }, { quoted: m });
  }
};