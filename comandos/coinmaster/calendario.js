// OROCHIMARU/comandos/coinmaster/calendario.js
const db = require('../../lib/db');

module.exports = {
  comando: 'calendario',
  descricao: 'Mostra o calendário real dos eventos detectados (Coin Master)',
  categoria: 'coinmaster',
  exec: async (m, { sock }) => {
    // Consulta eventos ordenados por data/hora
    db.all(`
      SELECT nome_evento, horario_detectado, dados 
      FROM eventos
      ORDER BY horario_detectado ASC
    `, [], async (err, rows) => {
      if (err) {
        console.error('Erro ao buscar eventos do banco:', err.message);
        return sock.sendMessage(m.chat, { text: '❌ Erro ao buscar calendário.' }, { quoted: m });
      }

      if (!rows || rows.length === 0) {
        return sock.sendMessage(m.chat, { text: '⚠️ Nenhum evento registrado até o momento.' }, { quoted: m });
      }

      // Agrupar por dia
      const calendario = {};

      for (const row of rows) {
        const dataObj = new Date(row.horario_detectado);
        const diaSemana = dataObj.toLocaleDateString('pt-BR', { weekday: 'long' });
        const hora = dataObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

        if (!calendario[diaSemana]) {
          calendario[diaSemana] = [];
        }

        calendario[diaSemana].push({
          hora,
          nome: row.nome_evento
        });
      }

      // Montar texto do calendário
      let texto = '📆 *CALENDÁRIO DE EVENTOS DETECTADOS*\n\n';

      for (const [dia, eventos] of Object.entries(calendario)) {
        texto += `• *${dia.charAt(0).toUpperCase() + dia.slice(1)}*\n`;
        for (const evento of eventos) {
          texto += `${evento.hora} – ${evento.nome}\n`;
        }
        texto += '\n';
      }

      texto += '⚠️ Horários baseados na detecção pelo bot (fuso horário do servidor).\n';

      await sock.sendMessage(m.chat, { text: texto.trim() }, { quoted: m });
    });
  }
};