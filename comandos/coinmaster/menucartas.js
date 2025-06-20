module.exports = {
  comando: 'menucartas',
  descricao: 'Exibe opções de cartas com botões',
  categoria: 'coinmaster',
  exec: async (m, { sock }) => {
    const buttons = [
      { buttonId: '/cartasraras', buttonText: { displayText: '🃏 Cartas Raras' }, type: 1 },
      { buttonId: '/set', buttonText: { displayText: '📚 Lista de Sets' }, type: 1 },
      { buttonId: '/trocas', buttonText: { displayText: '🔁 Trocas Disponíveis' }, type: 1 },
      { buttonId: '/giros', buttonText: { displayText: '🎰 Links de Giros' }, type: 1 }
    ];

    const buttonMessage = {
      text: '🃏 *Menu de Cartas*\n\nEscolha uma das opções abaixo:',
      buttons: buttons,
      headerType: 1
    };

    await sock.sendMessage(m.chat, buttonMessage, { quoted: m });
  }
};