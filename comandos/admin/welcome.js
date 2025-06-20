const fs = require('fs');
const path = require('path');
const welcomePath = path.join(__dirname, '../../lib/welcome.json');

module.exports = {
  comando: 'welcome',
  descricao: 'Ativar/Desativar mensagem de boas-vindas',
  categoria: 'admin',
  exec: async (m, { sock, isGroupAdmin }) => {
    if (!m.isGroup) {
      return sock.sendMessage(m.chat, { text: '❌ Este comando só pode ser usado em grupos.' }, { quoted: m });
    }

    if (!isGroupAdmin) {
      return sock.sendMessage(m.chat, {
        text: '❌ Apenas admins podem ativar ou desativar a mensagem de boas-vindas.'
      }, { quoted: m });
    }

    try {
      let dados = fs.existsSync(welcomePath)
        ? JSON.parse(fs.readFileSync(welcomePath))
        : {};

      dados[m.chat] = !dados[m.chat];
      fs.writeFileSync(welcomePath, JSON.stringify(dados, null, 2));

      const status = dados[m.chat] ? '✅ Ativado' : '❌ Desativado';
      await sock.sendMessage(m.chat, {
        text: `🎉 Mensagem de boas-vindas ${status}.`
      }, { quoted: m });

    } catch (err) {
      await sock.sendMessage(m.chat, {
        text: '❌ Erro ao alterar a configuração de boas-vindas.'
      }, { quoted: m });
    }
  }
};