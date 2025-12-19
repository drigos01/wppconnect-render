import express from 'express';
import wppconnect from '@wppconnect-team/wppconnect';

const app = express();
const PORT = process.env.PORT || 10000;

// ===============================
// EXPRESS (Render precisa disso)
// ===============================
app.get('/', (req, res) => {
  res.send('✅ WPPConnect rodando no Render');
});

app.listen(PORT, () => {
  console.log('🌐 Servidor HTTP ativo na porta', PORT);
});

// ===============================
// WPPConnect + Puppeteer
// ===============================
wppconnect.create({
  session: 'render-session',

  catchQR: (qrCode, asciiQR) => {
    console.log('\n📱 ESCANEIE O QR CODE:\n');
    console.log(asciiQR);
  },

  statusFind: (status) => {
    console.log('📡 Status WhatsApp:', status);
  },

  puppeteerOptions: {
    headless: 'new',
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--no-first-run',
      '--no-zygote',
      '--single-process'
    ]
  }
})
.then((client) => {
  console.log('✅ WhatsApp conectado com sucesso');

  client.onMessage((msg) => {
    console.log('📩 Mensagem recebida:', msg.from, '->', msg.body);
  });
})
.catch((err) => {
  console.error('❌ Erro ao iniciar WPPConnect:', err);
});
