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
    comandos[comando.comando] = comando;
  }
}

module.exports = comandos;