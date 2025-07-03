// 📄 OROCHIMARU/comandos/cadastro/setranking.js

const db = require('../../tmp/db');
const moment = require('moment');
const path = require('path');
const fs = require('fs');

module.exports = {
  comando: 'setranking',
  descricao: 'Cadastrar vila no ranking com data',
  categoria: 'cadastro',
  exec: async (m, { sock }) => {
    const body = m.message.conversation || m.message.extendedTextMessage?.text || '';
    const args = body.trim().split(/\s+/).slice(1);

    const textoInformativo = `📌 *Digite corretamente o comando conforme o exemplo abaixo:*

*setranking SEU NOME:NUMERO DA VILA*

Ex:
*setranking Wallace Correa:320*
*setranking Jefferson Texeira:130*

⚠️ *VALE LEMBRAR QUE O USO DOS DOIS PONTOS ( : ) É OBRIGATÓRIO!*`;

    if (args.length === 0 || !args.join(' ').includes(':')) {
      const videoPath = path.join(__dirname, '../../media/setranking.mp4');

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

    const entrada = args.join(' ').split(':');
    const nome = entrada[0].trim();
    const vila = parseInt(entrada[1].trim());
    const numero = m.key.participant || m.key.remoteJid;
    const data = moment().format('YYYY-MM-DD');

    if (isNaN(vila)) {
      return sock.sendMessage(m.key.remoteJid, {
        text: '❌ Número da vila inválido. Exemplo: *setranking Seu Nome:320*'
      }, { quoted: m });
    }

    db.run(
      `INSERT INTO ranking (numero, nome, pontos, data_atualizacao)
       VALUES (?, ?, ?, ?)
       ON CONFLICT(numero) DO UPDATE SET pontos = excluded.pontos, data_atualizacao = excluded.data_atualizacao`,
      [numero, nome, vila, data],
      (err) => {
        if (err) {
          console.error('Erro no setranking:', err.message);
          return sock.sendMessage(m.key.remoteJid, {
            text: '❌ Erro ao cadastrar sua vila no ranking.'
          }, { quoted: m });
        }

        sock.sendMessage(m.key.remoteJid, {
          text: `✅ ${nome} agora está na vila ${vila}.`
        }, { quoted: m });
      }
    );
  }
};
