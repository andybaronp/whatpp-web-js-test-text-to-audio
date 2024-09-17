const { Client, LocalAuth } = require('whatsapp-web.js');
const dotenv = require('dotenv').config();
const { voiceToText } = require('./whisperjs');
const qrcode = require('qrcode-terminal');
// Create a new client instance
const client = new Client(
  {
    authStrategy: new LocalAuth()
  }
);


// When the client is ready, run this code (only once)
client.once('ready', () => {
  console.log('Client is ready!');
});

// When the client received QR-Code
client.on('qr', (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on('message_create', async (message) => {

  if (message.type === 'ptt') {  // 'ptt' es el tipo para notas de voz en WhatsApp
    const media = await message.downloadMedia();

    if (media) {
      // Convertir la media base64 a buffer
      const buffer = Buffer.from(media.data, 'base64');

      try {
        // Convertir voz a texto usando Whisper, pasándole el buffer directamente
        const text = await voiceToText(buffer, `audio_${Date.now()}.ogg`);

        // Enviar la transcripción de vuelta al chat
        client.sendMessage(message.from, text);

      } catch (err) {
        console.error('Error al transcribir el audio:', err);
        client.sendMessage(message.from, 'Hubo un error al procesar la nota de voz.');
      }
    }
  }
  if (message.body === '!ping') {
    // Responder con "pong"
    client.sendMessage(message.from, 'pong');
  }
})
// Start your client
client.initialize();