const axios = require('axios');
const config = require('../../config/settings');
const { podeUsar } = require('../../lib/utils/iaLimiter');

module.exports = {
  comando: 'bot',
  descricao: 'Faz pergunta ao ChatGPT (resposta em texto)',
  categoria: 'gerais',
  exec: async (m, { sock, args }) => {
    const pergunta = args.join(' ');
    if (!pergunta) return sock.sendMessage(m.chat, { text: '❌ Use: *bot sua pergunta*' }, { quoted: m });

    const numero = m.sender;
    const uso = podeUsar(numero, 5); // Limite diário de 5 usos por número

    if (!uso.permitido) {
      return sock.sendMessage(m.chat, { text: '🚫 Limite diário de uso atingido. Tente amanhã.' }, { quoted: m });
    }

    try {
      await sock.sendPresenceUpdate('composing', m.chat);

      const resposta = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: pergunta }]
      }, {
        headers: {
          'Authorization': `Bearer ${config.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      const respostaTexto = resposta.data.choices[0].message.content;
      await sock.sendMessage(m.chat, {
        text: `🤖 ${respostaTexto}\n\n🧭 Restantes hoje: ${uso.restantes}`,
      }, { quoted: m });

    } catch (e) {
      console.error(e);
      await sock.sendMessage(m.chat, { text: '❌ Erro ao consultar a IA.' }, { quoted: m });
    }
  }
};