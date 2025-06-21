const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const pino = require('pino');
const fs = require('fs');
const path = require('path');

// Importa a função que executa os comandos
const comandos = require('./lib/functions');

// Importa a verificação de novos eventos da Coin Master
const { checkNovosEventos } = require('./lib/scraping/eventos');

// Pasta onde serão salvas as credenciais do bot (precisa existir!)
const authFolder = './auth';

async function startBot() {
  // Carrega ou cria autenticação
  const { state, saveCreds } = await useMultiFileAuthState(authFolder);

  // Inicializa o socket de conexão com o WhatsApp
  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true,
    logger: pino({ level: 'silent' }),
  });

  // Salva automaticamente as credenciais quando forem atualizadas
  sock.ev.on('creds.update', saveCreds);

  // Lida com reconexão automática se a conexão for encerrada
  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === 'close') {
      const motivo = new Boom(lastDisconnect?.error)?.output?.statusCode;
      if (motivo !== 401) startBot(); // Recomeça se não for erro de autenticação
    }
  });

  // Escuta mensagens recebidas
  sock.ev.on('messages.upsert', async ({ messages }) => {
    const m = messages[0];
    if (!m.message || m.key.fromMe) return;

    const body = m.message.conversation || m.message.extendedTextMessage?.text || '';
    const comando = body.toLowerCase().split(' ')[0];

    const from = m.key.remoteJid;
    const sender = m.key.participant || m.key.remoteJid;

    comandos.executarComando(comando, sock, m, from, sender);
  });

  // 🔔 Verifica novos eventos da Coin Master a cada 5 minutos
  setInterval(async () => {
    const novosEventos = await checkNovosEventos();
    if (novosEventos.length) {
      for (const evento of novosEventos) {
        await sock.sendMessage('120363XXXXX@g.us', {
          text: `📢 *Novo Evento Detectado!*\n\n📝 *${evento.titulo}*\n🔗 ${evento.link}`,
        });
      }
    }
  }, 5 * 60 * 1000); // 5 minutos
}

startBot();
