// 📄 OROCHIMARU/comandos/cadastro/setestrela.js

const db = require('../../lib/db');
const path = require('path');
const fs = require('fs');

module.exports = {
  comando: 'setestrela',
  descricao: 'Cadastrar estrelas',
  categoria: 'cadastro',
  exec: async (m, { sock, args }) => {
    const [estrelas] = args;
    const numero = m.sender;
    const nome = m.pushName;

    const textoInformativo = `📌 *Digite corretamente o comando conforme o exemplo abaixo:*

*setestrela QUANTIDADE DE ESTRELAS*

Ex:
*setestrela 81367*
*setestrela 75264*`;

    if (!estrelas || isNaN(estrelas)) {
      const videoPath = path.join(__dirname, '../../media/setestrela.mp4');

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
      'INSERT INTO estrelas (numero, nome, estrelas) VALUES (?, ?, ?) ON CONFLICT(numero) DO UPDATE SET estrelas = ?',
      [numero, nome, estrelas, estrelas],
      (err) => {
        if (err) {
          return sock.sendMessage(m.chat, { text: '❌ Erro ao cadastrar estrelas.' }, { quoted: m });
        }

        sock.sendMessage(m.chat, {
          text: `✨ ${nome} agora tem ${estrelas} estrelas.`,
        }, { quoted: m });
      }
    );
  }
};