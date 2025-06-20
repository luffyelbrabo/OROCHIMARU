const fs = require('fs');
const path = require('path');
const { OpenAI } = require('openai');
const { openai_api } = require('../../config/settings');

const openai = new OpenAI({
  apiKey: openai_api,
});

module.exports = {
  comando: 'ppt',
  descricao: 'Transcreve áudio em texto usando OpenAI Whisper',
  categoria: 'audio',
  exec: async (m, { sock }) => {
    try {
      // Verifica se a mensagem é uma resposta a áudio
      if (!m.quoted?.audioMessage && !m.quoted?.voiceMessage) {
        return sock.sendMessage(m.chat, { text: '❌ Responda a um áudio para transcrever.' }, { quoted: m });
      }

      // Baixar o áudio respondido
      const stream = await sock.downloadMediaMessage(m.quoted);
      const audioPath = path.join(__dirname, '../../temp/audio_to_transcribe.ogg');

      // Salvar o áudio em arquivo
      const writeStream = fs.createWriteStream(audioPath);
      await new Promise((resolve, reject) => {
        stream.pipe(writeStream);
        writeStream.on('finish', resolve);
        writeStream.on('error', reject);
      });

      // Enviar para a API OpenAI Whisper
      const transcription = await openai.audio.transcriptions.create({
        file: fs.createReadStream(audioPath),
        model: 'whisper-1',
        language: 'pt', // pode ajustar para o idioma desejado
      });

      // Apagar o arquivo temporário
      fs.unlinkSync(audioPath);

      // Enviar a transcrição pro chat
      await sock.sendMessage(m.chat, {
        text: `📝 Transcrição:\n\n${transcription.text}`,
      }, { quoted: m });

    } catch (error) {
      console.error('Erro na transcrição:', error);
      await sock.sendMessage(m.chat, {
        text: '❌ Ocorreu um erro ao tentar transcrever o áudio.',
      }, { quoted: m });
    }
  }
};