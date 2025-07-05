const db = require('../tmp/db');

db.run(`
  CREATE TABLE IF NOT EXISTS auth (
    id TEXT PRIMARY KEY,
    data TEXT
  )
`);

async function loadAuthStateFromDB() {
  return new Promise((resolve, reject) => {
    db.get('SELECT data FROM auth WHERE id = ?', ['baileys-auth'], (err, row) => {
      if (err) return reject(err);
      if (!row) return resolve({ creds: null, keys: {} });
      try {
        const state = JSON.parse(row.data);
        resolve(state);
      } catch (e) {
        resolve({ creds: null, keys: {} });
      }
    });
  });
}

async function saveAuthStateToDB(state) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(state);
    db.run(
      'INSERT OR REPLACE INTO auth (id, data) VALUES (?, ?)',
      ['baileys-auth', data],
      (err) => {
        if (err) return reject(err);
        resolve();
      }
    );
  });
}

module.exports = {
  loadAuthStateFromDB,
  saveAuthStateToDB
};