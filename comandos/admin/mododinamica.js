const fs = require('fs');
const path = require('path');
const pathFile = path.join(__dirname, '../../lib/dinamica.json');

module.exports = {
  comando: 'mododinamica',
  descricao: 'Ativa modo dinâmica (bloqueia comandos para membros)',
  categoria: 'admin',
  exec: async (m, { sock, isGroupAdmin }) => {
    if (!m.isGroup) {
      return sock.sendMessage(m.chat, { text: '❌ Este comando só funciona em grupos.' }, { quoted: m });
    }

    if (!isGroupAdmin) {
      return sock.sendMessage(m.chat, { text: '❌ Apenas admins podem ativar/desativar o modo dinâmica.' }, { quoted: m });
    }

    try {
      let dados = {};
      if (fs.existsSync(pathFile)) {
        dados = JSON.parse(fs.readFileSync(pathFile));
      }

      dados[m.chat] = !dados[m.chat];
      fs.writeFileSync(pathFile, JSON.stringify(dados, null, 2));

      const status = dados[m.chat] ? '🔒 Ativado' : '🔓 Desativado';
      await sock.sendMessage(m.chat, { text: `📢 Modo dinâmica ${status}.` }, { quoted: m });
    } catch (error) {
      await sock.sendMessage(m.chat, { text: '❌ Erro ao alterar o modo dinâmica.' }, { quoted: m });
    }
  }
};