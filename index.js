const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const pino = require('pino');
const fs = require('fs');
const path = require('path');
const comandos = require('./lib/functions');
const { checkNovosEventos } = require('./lib/scraping/eventos');

const authFolder = './auth';

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState(authFolder);

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true,
    logger: pino({ level: 'silent' }),
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === 'close') {
      const motivo = new Boom(lastDisconnect?.error)?.output?.statusCode;
      if (motivo !== 401) startBot();
    }
  });

  sock.ev.on('messages.upsert', async ({ messages }) => {
    const m = messages[0];
    if (!m.message || m.key.fromMe) return;

    const body = m.message.conversation || m.message.extendedTextMessage?.text || '';
    const comando = body.toLowerCase().split(' ')[0];

    const from = m.key.remoteJid;
    const sender = m.key.participant || m.key.remoteJid;

    // 🔍 Log automático para identificar o ID do grupo ou contato
    console.log(`📥 Mensagem recebida de: ${from}`);

    comandos.executarComando(comando, sock, m, from, sender);
  });

  // 🔔 Verificação periódica de eventos
  setInterval(async () => {
    const novosEventos = await checkNovosEventos();
    if (novosEventos.length) {
      for (const evento of novosEventos) {
        await sock.sendMessage('120363XXXXX@g.us', {
          text: `📢 *Novo Evento Detectado!*\n\n📝 *${evento.titulo}*\n🔗 ${evento.link}`,
        });
      }
    }
  }, 5 * 60 * 1000); // a cada 5 minutos
}

startBot();
