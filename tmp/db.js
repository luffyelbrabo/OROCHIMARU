const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('/tmp/orochimaru.db');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS ranking (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      numero TEXT UNIQUE,
      nome TEXT,
      pontos INTEGER DEFAULT 0,
      data_atualizacao TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS estrelas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      numero TEXT UNIQUE,
      nome TEXT,
      estrelas INTEGER DEFAULT 0,
      data_atualizacao TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS aniversarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      numero TEXT UNIQUE,
      nome TEXT,
      data TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS vilas_pet (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      numero TEXT UNIQUE,
      nome TEXT,
      vila_pet TEXT,
      data_atualizacao TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS eventos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome_evento TEXT UNIQUE,
      dados TEXT,
      data_atualizacao TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS giros (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tipo TEXT,
      link TEXT,
      data_coleta TEXT
    )
  `);
});

module.exports = db;
