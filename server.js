import express from 'express';
import wppconnect from '@wppconnect-team/wppconnect';

const app = express();
const PORT = process.env.PORT || 10000;

app.get('/', (req, res) => {
  res.send('✅ WPPConnect rodando no Render');
});

app.listen(PORT, () => {
  console.log('🌐 Servidor HTTP ativo na porta', PORT);
});

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
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage'
    ]
  }
})
.then((client) => {
  console.log('✅ WhatsApp conectado com sucesso');

  client.onMessage((msg) => {
    console.log('📩 Mensagem recebida:', msg.body);
  });
})
.catch((err) => {
  console.error('❌ Erro ao iniciar WPPConnect:', err);
});
