const fs = require('fs');
const { OpenAI, toFile } = require('openai');

// Función para convertir voz a texto usando Whisper
const voiceToText = async (filePath) => {
  console.log('Iniciando transcripción...');

  if (!fs.existsSync(filePath)) {
    throw new Error("No se encuentra el archivo");
  }

  try {
    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,  // Asegúrate de tener tu clave API en .env
    });

    const buffer = fs.readFileSync(filePath);

    const transcription = await client.audio.transcriptions.create({
      file: await toFile(buffer, filePath),
      model: 'whisper-1',
    });

    return transcription.text;

  } catch (err) {
    console.error('Error:', err);
    throw new Error(err.message || "Ocurrió un error durante la transcripción");
  }
};

module.exports = { voiceToText };