const { createCanvas, loadImage } = require('canvas');
const path = require('path');
const fs = require('fs');

async function gerarImagemAreia(texto) {
  const largura = 512;
  const altura = 512;
  const canvas = createCanvas(largura, altura);
  const ctx = canvas.getContext('2d');

  // Fundo de areia (imagem local ou cor)
  const fundoPath = path.join(__dirname, '../assets/areia.jpg');
  const fundo = fs.existsSync(fundoPath)
    ? await loadImage(fundoPath)
    : null;

  if (fundo) {
    ctx.drawImage(fundo, 0, 0, largura, altura);
  } else {
    ctx.fillStyle = '#e4c59e'; // cor parecida com areia
    ctx.fillRect(0, 0, largura, altura);
  }

  // Texto centralizado
  ctx.fillStyle = '#000';
  ctx.font = 'bold 40px Sans';
  ctx.textAlign = 'center';
  ctx.fillText(texto, largura / 2, altura / 2);

  return canvas.toBuffer();
}

module.exports = { gerarImagemAreia };