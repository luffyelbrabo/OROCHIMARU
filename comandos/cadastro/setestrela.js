// 📄 OROCHIMARU/comandos/cadastro/setestrela.js

const db = require('../../tmp/db');
const path = require('path');
const fs = require('fs');

module.exports = {
  comando: 'setestrela',
  descricao: 'Cadastrar estrelas',
  categoria: 'cadastro',
  exec: async (m, { sock }) => {
    const body = m.message.conversation || m.message.extendedTextMessage?.text || '';
    const args = body.trim().split(/\s+/).slice(1);
    const estrelas = args[0];

    const numero = m.key.participant || m.key.remoteJid;
    const nome = m.pushName;

    const textoInformativo = `📌 *Digite corretamente o comando conforme o exemplo abaixo:*

*setestrela QUANTIDADE DE ESTRELAS*

Ex:
*setestrela 81367*
*setestrela 75264*`;

    if (!estrelas || isNaN(estrelas)) {
      const videoPath = path.join(__dirname, '../../media/setestrela.mp4');

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
      `INSERT INTO estrelas (numero, nome, estrelas)
       VALUES (?, ?, ?)
       ON CONFLICT(numero) DO UPDATE SET estrelas = excluded.estrelas`,
      [numero, nome, estrelas],
      (err) => {
        if (err) {
          console.error('Erro no setestrela:', err.message);
          return sock.sendMessage(m.key.remoteJid, {
            text: '❌ Erro ao cadastrar estrelas.'
          }, { quoted: m });
        }

        sock.sendMessage(m.key.remoteJid, {
          text: `✨ ${nome} agora tem ${estrelas} estrelas.`
        }, { quoted: m });
      }
    );
  }
};
