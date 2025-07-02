// 📄 OROCHIMARU/comandos/cadastro/setaniversario.js

const db = require('../../tmp/db');
const path = require('path');
const fs = require('fs');

module.exports = {
  comando: 'setaniversario',
  descricao: 'Cadastrar data de aniversário',
  categoria: 'cadastro',
  exec: async (m, { sock, args }) => {
    const data = args[0];
    const numero = m.sender;
    const nome = m.pushName;

    const textoInformativo = `🎂 *Por favor, insira uma data válida no formato DD/MM/AAAA ou DD/MM*\n\n📌 *Seguindo o exemplo do vídeo.*`;

    if (!data || !/^(\d{2})\/(\d{2})(\/\d{4})?$/.test(data)) {
      const videoPath = path.join(__dirname, '../../media/setaniversario.mp4');

      if (fs.existsSync(videoPath)) {
        await sock.sendMessage(m.chat, {
          video: fs.readFileSync(videoPath),
          caption: textoInformativo
        }, { quoted: m });
      } else {
        await sock.sendMessage(m.chat, {
          text: textoInformativo + '\n\n⚠️ (O vídeo explicativo não foi encontrado no caminho esperado.)'
        }, { quoted: m });
      }

      return;
    }

    db.run(
      'INSERT INTO aniversarios (numero, nome, data) VALUES (?, ?, ?) ON CONFLICT(numero) DO UPDATE SET data = ?',
      [numero, nome, data, data],
      (err) => {
        if (err) {
          return sock.sendMessage(m.chat, { text: '❌ Erro ao cadastrar o aniversário.' }, { quoted: m });
        }

        sock.sendMessage(m.chat, {
          text: `🎉 ${nome}, seu aniversário foi cadastrado como *${data}*.`,
        }, { quoted: m });
      }
    );
  }
};
