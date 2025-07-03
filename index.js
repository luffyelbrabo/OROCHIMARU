const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

const QRCode = require('qrcode');

let ultimoQR = '';

app.get('/', (req, res) => {
  res.send('Bot OROCHIMARU rodando no Render!');
});

app.get('/qrcode', async (req, res) => {
  if (!ultimoQR) return res.send('QR code ainda não gerado.');

  try {
    const url = await QRCode.toDataURL(ultimoQR);
    res.send(`<h2>Escaneie o QR code abaixo no seu WhatsApp:</h2><img src="${url}" />`);
  } catch (e) {
    res.send('Erro ao gerar o QR code.');
  }
});

app.listen(PORT, () => {
  console.log(`Servidor web escutando na porta ${PORT}`);
});

// ---------------------------
// SEU BOT WHATSAPP
// ---------------------------
const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const pino = require('pino');
const fs = require('fs');
const path = require('path');
const qrcodeTerminal = require('qrcode-terminal');

const comandos = require('./lib/functions');
const { checkNovosEventos } = require('./lib/scraping/eventos');

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

    if (qr) {
      ultimoQR = qr;
      console.log('📱 QR CODE disponível no terminal e no navegador em: /qrcode');
      qrcodeTerminal.generate(qr, { small: true });
    }

    if (connection === 'close') {
      const motivo = new Boom(lastDisconnect?.error)?.output?.statusCode;
      if (motivo !== 401) startBot();
    }

    if (connection === 'open') {
      console.log('✅ Bot conectado ao WhatsApp!');
    }
  });

  sock.ev.on('messages.upsert', async ({ messages }) => {
    const m = messages[0];
    if (!m.message || m.key.fromMe) return;

    const body = m.message.conversation || m.message.extendedTextMessage?.text || '';
    const comando = body.toLowerCase().split(' ')[0].replace(/^\*/, ''); // Remove o *

    const from = m.key.remoteJid;
    const sender = m.key.participant || m.key.remoteJid;

    comandos.executarComando(comando, sock, m, from, sender);
  });

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

startBot();
