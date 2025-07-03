// 📄 OROCHIMARU/comandos/cadastro/setaniversario.js

const db = require('../../tmp/db');
const path = require('path');
const fs = require('fs');

module.exports = {
  comando: 'setaniversario',
  descricao: 'Cadastrar data de aniversário',
  categoria: 'cadastro',
  exec: async (m, { sock }) => {
    const body = m.message.conversation || m.message.extendedTextMessage?.text || '';
    const args = body.trim().split(/\s+/).slice(1);
    const data = args[0];

    const numero = m.key.participant || m.key.remoteJid;
    const nome = m.pushName;

    const textoInformativo = `🎂 *Por favor, insira uma data válida no formato DD/MM/AAAA ou DD/MM*\n\n📌 *Seguindo o exemplo do vídeo.*`;

    if (!data || !/^(\d{2})\/(\d{2})(\/\d{4})?$/.test(data)) {
      const videoPath = path.join(__dirname, '../../media/setaniversario.mp4');

      if (fs.existsSync(videoPath)) {
        await sock.sendMessage(m.key.remoteJid, {
          video: fs.readFileSync(videoPath),
          caption: textoInformativo
        }, { quoted: m });
      } else {
        await sock.sendMessage(m.key.remoteJid, {
          text: textoInformativo + '\n\n⚠️ (O vídeo explicativo não foi encontrado no caminho esperado.)'
        }, { quoted: m });
      }

      return;
    }

    db.run(
      `INSERT INTO aniversarios (numero, nome, data) 
       VALUES (?, ?, ?) 
       ON CONFLICT(numero) DO UPDATE SET data = excluded.data`,
      [numero, nome, data],
      (err) => {
        if (err) {
          console.error('Erro no setaniversario:', err.message);
          return sock.sendMessage(m.key.remoteJid, {
            text: '❌ Erro ao cadastrar o aniversário.'
          }, { quoted: m });
        }

        sock.sendMessage(m.key.remoteJid, {
          text: `🎉 ${nome}, seu aniversário foi cadastrado como *${data}*.`
        }, { quoted: m });
      }
    );
  }
};
