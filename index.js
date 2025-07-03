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
      // Convertemos o QR em um Data URL (para exibir no navegador)
      const qrImage = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qr)}&size=300x300`;
      ultimoQrCode = qrImage;
      console.log(`📱 Novo QR gerado! Acesse: /qrcode`);
    }

    if (connection === 'close') {
      const motivo = new Boom(lastDisconnect?.error)?.output?.statusCode;
      if (motivo !== 401) startBot();
    }

    if (connection === 'open') {
      console.log('✅ Bot conectado ao WhatsApp!');
      ultimoQrCode = null; // Limpa o QR ao conectar
    }
  });

  sock.ev.on('messages.upsert', async ({ messages }) => {
    const m = messages[0];
    if (!m.message || m.key.fromMe) return;

    const body = m.message.conversation || m.message.extendedTextMessage?.text || '';
    const comando = body.toLowerCase().split(' ')[0].replace(/^\*/, '');

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
