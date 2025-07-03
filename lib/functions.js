// lib/functions.js
const path = require('path');
const fs = require('fs');

const comandos = {};

const categorias = ['especiais', 'menu', 'audio', 'cadastro', 'coinmaster', 'admin', 'gerais'];

for (const categoria of categorias) {
  const dir = path.join(__dirname, `../comandos/${categoria}`);
  if (!fs.existsSync(dir)) continue;

  const arquivos = fs.readdirSync(dir).filter(arquivo => arquivo.endsWith('.js'));

  for (const arquivo of arquivos) {
    const comando = require(path.join(dir, arquivo));
    if (comando.comando) {
      comandos[comando.comando] = comando;
    }
  }
}

console.log('✅ Comandos carregados:', Object.keys(comandos));

// Função para executar um comando pelo nome
async function executarComando(nome, sock, m, from, sender) {
  nome = nome.replace(/^\*/, '').toLowerCase();

  const cmd = comandos[nome];
  if (!cmd) {
    console.log(`❌ Comando não encontrado: ${nome}`);
    return;
  }

  console.log(`🚀 Executando comando: ${nome}`);

  try {
    await cmd.exec(m, { sock, from, sender });
  } catch (err) {
    console.error(`Erro ao executar comando ${nome}:`, err);
  }
}

module.exports = {
  comandos,
  executarComando,
};
