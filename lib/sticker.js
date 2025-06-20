const { Sticker, StickerTypes } = require('wa-sticker-formatter');

/**
 * Gera uma figurinha em formato WebP a partir de imagem buffer.
 * @param {Buffer} buffer - Imagem em buffer.
 * @param {Object} options - Opções como pack, author e tipo de figurinha.
 * @returns {Promise<Buffer>} - Buffer da figurinha WebP.
 */
async function sticker(buffer, options = {}) {
  const sticker = new Sticker(buffer, {
    pack: options.pack || 'OROCHIMARU',
    author: options.author || 'Douglas',
    type: StickerTypes[options.type?.toUpperCase()] || StickerTypes.DEFAULT,
    quality: 70
  });

  return await sticker.toBuffer();
}

module.exports = { sticker };