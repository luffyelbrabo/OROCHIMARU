const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const fs = require('fs');
const path = require('path');

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
const comandos = require('./lib/functions');
let checkNovosEventos;
try {
  ({ checkNovosEventos } = require('./lib/scraping/eventos'));
} catch {
  console.warn('⚠️ checkNovosEventos não foi carregado. Ignorando checagem de eventos.');
}

const authFolder = './auth';

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState(authFolder);

  const sock = makeWASocket({
    auth: state,
    logger: pino({ level: 'silent' }),
  });

  sock.ev.on('creds.update', saveCreds);

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

      // 📝 EXIBE OS ARQUIVOS DA PASTA /auth NO TERMINAL
      try {
        const arquivos = fs.readdirSync(authFolder);
        arquivos.forEach(arquivo => {
          const conteudo = fs.readFileSync(path.join(authFolder, arquivo), 'utf8');
          console.log(`\n--- ${arquivo} ---\n${conteudo}\n`);
        });
      } catch (e) {
        console.error('❌ Erro ao ler os arquivos da pasta auth:', e.message);
      }
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
