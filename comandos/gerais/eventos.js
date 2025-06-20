const { getEventos, checkNovosEventos } = require('../../lib/scraping/eventos');

module.exports = {
  comando: 'eventos',
  descricao: 'Lista eventos atuais e avisa sobre novidades',
  categoria: 'gerais',
  exec: async (m, { sock }) => {
    const novos = await checkNovosEventos();
    const todos = await getEventos();

    // Notifica novos eventos
    let texto = '';
    if (novos.length > 0) {
      texto += `🆕 *Novos eventos encontrados:*\n`;
      novos.forEach(ev => {
        texto += `- *${ev.titulo}*\n${ev.link}\n`;
      });
      texto += `\n`;
    }

    texto += `📅 *Eventos atuais:*\n`;
    todos.forEach(ev => {
      texto += `- ${ev.titulo}\n${ev.link}\n`;
    });

    await sock.sendMessage(m.chat, { text: texto }, { quoted: m });
  }
};