const { getEventos } = require('../../lib/scraping/eventos');

module.exports = { comando: 'sequencia', descricao: 'Mostra a sequência de giros dos eventos', categoria: 'coinmaster', exec: async (m, { sock }) => { let tipoEvento = 'padrão'; try { const eventos = await getEventos(); const ultimo = eventos[0]?.titulo?.toLowerCase() || '';

if (ultimo.includes('10 pontos')) tipoEvento = '10p';
  else if (ultimo.includes('misto') || ultimo.includes('porco')) tipoEvento = 'misto';
} catch (e) {
  console.log('Erro ao detectar evento:', e);
}

let texto = `🎰 *Nova sequência Coin Master*\n\n`;

if (tipoEvento === '10p') {
  texto += `🔸 *Evento 10 Pontos*\n\n📌 *Sem Bet Blast*:\nx1 - 80\nx15 - 30\nx50 - 30\nx400 - 30\nx1500 - 30\n\n📌 *Com Bet Blast*:\nx1 - 70\nx15 - 20\nx50 - 20\nx250 - 20\nx400 - 20\nx800 - 20\nx1500 - 30\nx2500 - 20\nx6000 - ???`;
} else if (tipoEvento === 'misto') {
  texto += `🔸 *Evento Misto / Porco*\n\n📌 *Sem Bet Blast*:\nx1 - 80\nx15 - 30\nx50 - 30\nx400 - 30\nx1500 - 30\n\n📌 *Com Bet Blast*:\nx1 - 70\nx15 - 20\nx50 - 20\nx250 - 20\nx400 - 20\nx800 - 20\nx1500 - 30\nx2500 - 20\nx6000 - ???`;
} else {
  texto += `🔸 *Evento Padrão*\n\n📌 x1 - 80\n📌 x15 - 30\n📌 x50 - 30\n📌 x400 - 30\n📌 x1500 - 30\n\n(ℹ️ Tipo de evento não detectado automaticamente)`;
}

await sock.sendMessage(m.chat, { text: texto }, { quoted: m });

} };

