const fs = require('fs');
const path = require('path');
const regrasPath = path.join(__dirname, '../../lib/regras.json');

module.exports = {
  comando: 'setregras',
  descricao: 'Definir regras do grupo',
  categoria: 'admin',
  exec: async (m, { sock, args, isGroupAdmin }) => {
    if (!m.isGroup) {
      return sock.sendMessage(m.chat, { text: '❌ Este comando só pode ser usado em grupos.' }, { quoted: m });
    }

    if (!isGroupAdmin) {
      return sock.sendMessage(m.chat, { text: '❌ Apenas admins podem definir as regras do grupo.' }, { quoted: m });
    }

    const texto = args.join(' ');
    if (!texto) {
      return sock.sendMessage(m.chat, { text: '❌ Use: *setregras Texto das regras*' }, { quoted: m });
    }

    try {
      const regrasData = fs.existsSync(regrasPath) ? JSON.parse(fs.readFileSync(regrasPath)) : {};
      regrasData[m.chat] = texto;
      fs.writeFileSync(regrasPath, JSON.stringify(regrasData, null, 2));
      await sock.sendMessage(m.chat, { text: '📜 Regras atualizadas com sucesso!' }, { quoted: m });
    } catch (error) {
      await sock.sendMessage(m.chat, { text: '❌ Erro ao salvar as regras.' }, { quoted: m });
    }
  }
};