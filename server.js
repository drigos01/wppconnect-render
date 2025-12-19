import express from 'express';
import wppconnect from '@wppconnect-team/wppconnect';

const app = express();
const PORT = process.env.PORT || 3000;

// rota obrigatória pro Render
app.get('/', (req, res) => {
  res.send('✅ WPPConnect rodando no Render');
});

app.listen(PORT, () => {
  console.log('Servidor HTTP ativo na porta', PORT);
});

// inicia o WhatsApp
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
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  }
})
.then((client) => {
  console.log('✅ WhatsApp conectado');

  client.onMessage((msg) => {
    console.log('📩 Mensagem recebida:', msg.body);
  });
})
.catch(err => {
  console.error('❌ Erro ao iniciar WPPConnect:', err);
});
