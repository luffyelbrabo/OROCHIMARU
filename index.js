const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

let ultimoQrCode = null;

const INTERVALOS_EVENTO_MINUTOS = {
  curto: 10, // eventos como mania, bet blast
  medio: 30, // eventos como raid madness
  longo: 60  // eventos como torneio, viking
};

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

const { default: makeWASocket } = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const pino = require('pino');
const comandos = require('./lib/functions');
const { buscarTodosEventos } = require('./lib/scraping/eventos');
const db = require('./tmp/db');
const { loadAuthStateFromDB, saveAuthStateToDB } = require('./lib/authDb');

async function startBot() {
  let state = await loadAuthStateFromDB();

  const saveCreds = async () => {
    await saveAuthStateToDB(state);
  };

  const sock = makeWASocket({
    auth: {
      creds: state.creds,
      keys: state.keys,
      saveCreds
    },
    logger: pino({ level: 'silent' }),
  });

  sock.ev.on('creds.update', async (creds) => {
    state.creds = creds;
    await saveCreds();
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

    if (!body.startsWith('*')) {
      console.log('💬 Mensagem sem comando. Ignorada.');
      return;
    }

    const comandoRaw = body.split(' ')[0] || '';
    const comando = comandoRaw.replace(/^\*/, '').toLowerCase();

    console.log(`📥 Mensagem recebida: ${body}`);
    console.log(`👉 Comando detectado: ${comando}`);

    const from = m.key.remoteJid;
    const sender = m.key.participant || m.key.remoteJid;

    comandos.executarComando(comando, sock, m, from, sender);
  });

  setInterval(async () => {
    console.log('🔍 Verificando eventos...');
    const eventos = await buscarTodosEventos();

    if (!eventos || !eventos.length) {
      console.log('ℹ️ Nenhum novo evento detectado.');
      return;
    }

    db.all(`SELECT id FROM grupos`, [], async (err, grupos) => {
      if (err) {
        console.error('❌ Erro ao buscar grupos:', err);
        return;
      }
      if (!grupos.length) {
        console.log('⚠️ Nenhum grupo cadastrado.');
        return;
      }

      for (const evento of eventos) {
        const tipoEvento = definirTipoEvento(evento.nome_evento);
        const intervaloMin = INTERVALOS_EVENTO_MINUTOS[tipoEvento] || 10;

        db.get(
          `SELECT 1 FROM eventos WHERE nome_evento = ? AND notificado = 1 AND horario_detectado >= datetime('now', '-${intervaloMin} minutes')`,
          [evento.nome_evento],
          async (err, row) => {
            if (err) {
              console.error('❌ Erro ao consultar evento no banco:', err);
              return;
            }

            if (!row) {
              db.run(
                `INSERT INTO eventos (nome_evento, horario_detectado, dados, data_atualizacao, notificado)
                 VALUES (?, ?, ?, ?, 1)`,
                [
                  evento.nome_evento,
                  new Date().toISOString(),
                  JSON.stringify(evento),
                  new Date().toISOString()
                ]
              );

              console.log(`✅ Notificando novo evento [${tipoEvento}] -> ${evento.nome_evento}`);

              for (const grupo of grupos) {
                try {
                  await sock.sendMessage(grupo.id, {
                    text: `📢 *Novo Evento Detected!*\n\n📝 *${evento.nome_evento}*\n🔗 ${evento.link || 'Link no banco de dados'}`,
                  });
                } catch (e) {
                  console.error(`❌ Erro ao enviar para ${grupo.id}:`, e);
                }
              }
            } else {
              console.log(`🔹 Evento ${evento.nome_evento} já foi notificado nos últimos ${intervaloMin} min.`);
            }
          }
        );
      }
    });
  }, 1 * 60 * 1000); // verifica a cada 1 min
}

// Função simples para definir tipo do evento
function definirTipoEvento(nome) {
  nome = nome.toLowerCase();
  if (nome.includes('mania') || nome.includes('blast') || nome.includes('boom')) return 'curto';
  if (nome.includes('madness') || nome.includes('master')) return 'medio';
  return 'longo';
}

startBot();