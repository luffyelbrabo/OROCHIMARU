const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

let ultimoQrCode = null;

app.get('/', (req, res) => {
  res.send('Bot OROCHIMARU rodando no Render!');
});

app.get('/qrcode', (req, res) => {
  if (ultimoQrCode) {
    res.send(`<img src="${ultimoQrCode}" />`);
  } else {
    res.send('Nenhum QR Code disponível no momento.');
  }
});

app.listen(PORT, () => {
  console.log(`Servidor web escutando na porta ${PORT}`);
});

const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const pino = require('pino');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const comandos = require('./lib/functions');

let checkNovosEventos;
try {
  ({ checkNovosEventos } = require('./lib/scraping/eventos'));
} catch {
  console.warn('⚠️ checkNovosEventos não foi carregado. Ignorando checagem de eventos.');
}

const authFolder = './auth';

// Função para enviar arquivo para GitHub
async function enviarParaGithub(nomeArquivo, conteudo) {
  const username = 'luffyelbrabo';
  const repo = 'OROCHIMARU';
  const branch = 'main';
  const token = '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';
  const caminhoApi = `https://api.github.com/repos/${username}/${repo}/contents/auth/${nomeArquivo}`;

  try {
    // Verificar se o arquivo já existe para pegar o SHA
    const { data: dadoExistente } = await axios.get(caminhoApi, {
      headers: { Authorization: `token ${token}` }
    }).catch(() => ({ data: null }));

    const sha = dadoExistente?.sha;

    await axios.put(caminhoApi, {
      message: `Atualizando ${nomeArquivo}`,
      content: Buffer.from(conteudo).toString('base64'),
      branch,
      sha
    }, {
      headers: {
        Authorization: `token ${token}`
      }
    });

    console.log(`✅ Arquivo ${nomeArquivo} atualizado no GitHub.`);
  } catch (err) {
    console.error(`❌ Falha ao enviar ${nomeArquivo} para o GitHub:`, err.response?.data || err.message);
  }
}

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState(authFolder);

  const sock = makeWASocket({
    auth: state,
    logger: pino({ level: 'silent' }),
  });

  sock.ev.on('creds.update', async () => {
    await saveCreds();

    // Atualizar arquivos no GitHub
    fs.readdir(authFolder, async (err, files) => {
      if (err) {
        console.error('❌ Erro ao ler a pasta /auth:', err);
        return;
      }

      for (const file of files) {
        const filePath = path.join(authFolder, file);
        if (fs.lstatSync(filePath).isFile()) {
          const content = fs.readFileSync(filePath, 'utf-8');
          await enviarParaGithub(file, content);
        }
      }
    });
  });

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr && !ultimoQrCode) {
      const qrImage = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qr)}&size=300x300`;
      ultimoQrCode = qrImage;
      console.log(`📱 Novo QR gerado! Acesse: /qrcode`);
    }

    if (connection === 'close') {
      const motivo = new Boom(lastDisconnect?.error)?.output?.statusCode;
      console.log(`🔌 Conexão encerrada (${motivo || 'desconhecido'}). Tentando reconectar...`);
      if (motivo !== 401) startBot();
    }

    if (connection === 'open') {
      console.log('✅ Bot conectado ao WhatsApp!');
      ultimoQrCode = null;
    }
  });

  sock.ev.on('messages.upsert', async ({ messages }) => {
    const m = messages[0];
    if (!m.message || m.key.fromMe) return;

    if (!m.key.remoteJid) {
      console.log('❌ JID inválido. Mensagem ignorada.');
      return;
    }

    const body = m.message.conversation || m.message.extendedTextMessage?.text || '';
    const comandoRaw = body.split(' ')[0] || '';
    const comando = comandoRaw.replace(/^\*/, '').toLowerCase();

    console.log(`📥 Mensagem recebida: ${body}`);
    console.log(`👉 Comando detectado: ${comando}`);

    const from = m.key.remoteJid;
    const sender = m.key.participant || m.key.remoteJid;

    comandos.executarComando(comando, sock, m, from, sender);
  });

  if (checkNovosEventos) {
    setInterval(async () => {
      const novosEventos = await checkNovosEventos();
      if (novosEventos.length) {
        for (const evento of novosEventos) {
          await sock.sendMessage('120363XXXXX@g.us', {
            text: `📢 *Novo Evento Detectado!*\n\n📝 *${evento.titulo}*\n🔗 ${evento.link}`,
          });
        }
      }
    }, 5 * 60 * 1000);
  }
}

startBot();
