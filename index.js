const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const pino = require('pino');
const QRCode = require('qrcode');

const comandos = require('./lib/functions');
const { buscarTodosEventos } = require('./lib/scraping/eventos');
const authFolder = './auth';

let ultimoQrDataUrl = '';

app.get('/', (req, res) => {
  res.send('Bot OROCHIMARU rodando no Render! Acesse <a href="/qrcode">/qrcode</a> para escanear o QR code.');
});

app.get('/qrcode', (req, res) => {
  if (ultimoQrDataUrl) {
    res.send(`
      <html>
        <body>
          <h1>Escaneie o QR code</h1>
          <img src="${ultimoQrDataUrl}" />
        </body>
      </html>
    `);
  } else {
    res.send('QR code ainda não gerado. Aguarde o bot inicializar.');
  }
});

app.listen(PORT, () => {
  console.log(`Servidor web escutando na porta ${PORT}`);
});

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
      QRCode.toDataURL(qr, (err, url) => {
        if (!err) {
          ultimoQrDataUrl = url;
          console.log('🌐 QR code disponível em: /qrcode');
        } else {
          console.error('❌ Erro ao gerar QR:', err);
        }
      });
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
    const comando = body.toLowerCase().split(' ')[0];

    const from = m.key.remoteJid;
    const sender = m.key.participant || m.key.remoteJid;

    comandos.executarComando(comando, sock, m, from, sender);
  });

  setInterval(async () => {
  const eventos = await buscarTodosEventos();
  if (eventos.length) {
    for (const evento of eventos) {
      await sock.sendMessage('120363XXXXX@g.us', {
        text: `📢 *Link de Giros!*\n📝 ${evento.titulo}\n🔗 ${evento.link}`
      });
    }
  }
}, 5 * 60 * 1000);
    }

startBot();
