const fs = require('fs');
const { OpenAI, toFile } = require('openai');

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,  // Asegúrate de tener tu clave API en .env
});
// Función para convertir voz a texto usando Whisper
const voiceToText = async (buffer, fileName) => {
  console.log('Iniciando transcripción...');

  try {
    const transcription = await client.audio.transcriptions.create({
      file: await toFile(buffer, fileName),
      model: 'whisper-1',
      language: 'es',
    });

    return transcription.text;

  } catch (err) {
    console.error('Error:', err);
    throw new Error(err.message || "Ocurrió un error durante la transcripción");
  }
};

module.exports = { voiceToText };