const fs = require('fs');
const path = require('path');

const cachePath = path.join(__dirname, '../../lib/cache/eventos_cache.json');

module.exports = {
  comando: 'eventos',
  descricao: 'Exibe os eventos atuais do Coin Master',
  categoria: 'coinmaster',
  exec: async (m, { sock }) => {
    if (!fs.existsSync(cachePath)) {
      return sock.sendMessage(m.chat, { text: '⚠️ Nenhum evento foi detectado ainda. Aguarde a próxima verificação automática.' }, { quoted: m });
    }

    const dados = JSON.parse(fs.readFileSync(cachePath));
    const eventos = dados.eventos;

    if (!eventos || !eventos.length) {
      return sock.sendMessage(m.chat, { text: '⚠️ Nenhum evento disponível no momento.' }, { quoted: m });
    }

    const lista = eventos
      .slice(0, 10)
      .map((ev, i) => `📌 *${ev.titulo}*\n🔗 ${ev.link}`)
      .join('\n\n');

    await sock.sendMessage(m.chat, {
      text: `📅 *Eventos Coin Master:*\n\n${lista}`
    }, { quoted: m });
  }
};