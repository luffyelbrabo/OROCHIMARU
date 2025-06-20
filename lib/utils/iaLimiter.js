const fs = require('fs');
const path = require('path');
const cachePath = path.join(__dirname, '../cache/ia_limiter.json');

function carregarLimites() {
  if (!fs.existsSync(cachePath)) fs.writeFileSync(cachePath, '{}');
  return JSON.parse(fs.readFileSync(cachePath));
}

function salvarLimites(dados) {
  fs.writeFileSync(cachePath, JSON.stringify(dados, null, 2));
}

function podeUsar(numero, limite = 5) {
  const limites = carregarLimites();
  const hoje = new Date().toISOString().slice(0, 10);

  if (!limites[numero]) {
    limites[numero] = { [hoje]: 1 };
  } else {
    limites[numero][hoje] = (limites[numero][hoje] || 0) + 1;
  }

  if (limites[numero][hoje] > limite) {
    return { permitido: false, restantes: 0 };
  }

  salvarLimites(limites);
  return { permitido: true, restantes: limite - limites[numero][hoje] };
}

module.exports = { podeUsar };