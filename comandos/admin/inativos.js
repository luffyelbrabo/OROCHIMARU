const db = require('../../tmp/db');

module.exports = {
  comando: 'inativos',
  descricao: 'Lista de membros com pouca atividade',
  categoria: 'admin',
  exec: async (m, { sock, isGroupAdmin }) => {
    if (!m.isGroup) {
      return sock.sendMessage(m.chat, { text: '❌ Este comando só pode ser usado em grupos.' }, { quoted: m });
    }

    if (!isGroupAdmin) {
      return sock.sendMessage(m.chat, { text: '❌ Apenas admins podem ver os inativos.' }, { quoted: m });
    }

    db.all('SELECT nome, mensagens FROM mensagens WHERE grupo = ? ORDER BY mensagens ASC LIMIT 10', [m.chat], async (err, rows) => {
      if (err) {
        return sock.sendMessage(m.chat, { text: '❌ Erro ao acessar o banco de dados.' }, { quoted: m });
      }

      if (!rows.length) {
        return sock.sendMessage(m.chat, { text: '⚠️ Nenhum dado de atividade foi encontrado ainda.' }, { quoted: m });
      }

      const texto = rows.map((r, i) => `${i + 1}. ${r.nome} - ${r.mensagens} msg`).join('\n');
      await sock.sendMessage(m.chat, {
        text: `📉 Membros menos ativos:\n\n${texto}`
      }, { quoted: m });
    });
  }
};
