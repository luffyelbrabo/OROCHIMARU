// OROCHIMARU/tmp/migrar_eventos.js
const db = require('./db');

db.run(`ALTER TABLE eventos ADD COLUMN notificado INTEGER DEFAULT 0`, (err) => {
  if (err) {
    console.error('⚠️ Erro ao alterar tabela (pode ser que o campo já exista):', err.message);
  } else {
    console.log('✅ Coluna notificado adicionada com sucesso!');
  }
  db.close();
});