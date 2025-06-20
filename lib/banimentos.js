const fs = require('fs');
const path = require('path');
const banidosPath = path.join(__dirname, '../../lib/banidos.json');

function carregarBanidos() {
  if (!fs.existsSync(banidosPath)) fs.writeFileSync(banidosPath, '[]');
  return JSON.parse(fs.readFileSync(banidosPath));
}

function salvarBanidos(lista) {
  fs.writeFileSync(banidosPath, JSON.stringify(lista, null, 2));
}

function banir(numero) {
  const banidos = carregarBanidos();
  if (!banidos.includes(numero)) {
    banidos.push(numero);
    salvarBanidos(banidos);
  }
}

function desbanir(numero) {
  let banidos = carregarBanidos();
  banidos = banidos.filter(n => n !== numero);
  salvarBanidos(banidos);
}

function estaBanido(numero) {
  return carregarBanidos().includes(numero);
}

module.exports = {
  carregarBanidos,
  banir,
  desbanir,
  estaBanido
};