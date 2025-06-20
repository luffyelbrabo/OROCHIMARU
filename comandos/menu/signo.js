module.exports = {
  comando: 'signo',
  descricao: 'Exibe menu com comandos de signos',
  categoria: 'menu',
  exec: async (m, { sock }) => {
    const texto = `🔮 *Descubra seu horóscopo diário!*

Para saber sobre seu signo, basta clicar em um dos botões abaixo ou usar o comando *signo + nome*.

Exemplo: *signo touro*

📅 *Datas dos Signos*:
♈ Áries (21/03 - 20/04)
♉ Touro (21/04 - 20/05)
♊ Gêmeos (21/05 - 20/06)
♋ Câncer (21/06 - 22/07)
♌ Leão (23/07 - 22/08)
♍ Virgem (23/08 - 22/09)
♎ Libra (23/09 - 22/10)
♏ Escorpião (23/10 - 21/11)
♐ Sagitário (22/11 - 21/12)
♑ Capricórnio (22/12 - 20/01)
♒ Aquário (21/01 - 18/02)
♓ Peixes (19/02 - 20/03)`;

    const botoes = [
      { buttonId: 'signo aries', buttonText: { displayText: '♈ Áries' }, type: 1 },
      { buttonId: 'signo touro', buttonText: { displayText: '♉ Touro' }, type: 1 },
      { buttonId: 'signo gemeos', buttonText: { displayText: '♊ Gêmeos' }, type: 1 },
      { buttonId: 'signo cancer', buttonText: { displayText: '♋ Câncer' }, type: 1 },
      { buttonId: 'signo leao', buttonText: { displayText: '♌ Leão' }, type: 1 },
      { buttonId: 'signo virgem', buttonText: { displayText: '♍ Virgem' }, type: 1 },
      { buttonId: 'signo libra', buttonText: { displayText: '♎ Libra' }, type: 1 },
      { buttonId: 'signo escorpiao', buttonText: { displayText: '♏ Escorpião' }, type: 1 },
      { buttonId: 'signo sagitario', buttonText: { displayText: '♐ Sagitário' }, type: 1 },
      { buttonId: 'signo capricornio', buttonText: { displayText: '♑ Capricórnio' }, type: 1 },
      { buttonId: 'signo aquario', buttonText: { displayText: '♒ Aquário' }, type: 1 },
      { buttonId: 'signo peixes', buttonText: { displayText: '♓ Peixes' }, type: 1 }
    ];

    await sock.sendMessage(m.chat, {
      text: texto,
      buttons: botoes,
      footer: 'Selecione seu signo para ver o horóscopo.',
    }, { quoted: m });
  }
};