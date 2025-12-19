import express from 'express';
import wppconnect from '@wppconnect-team/wppconnect';
import puppeteer from 'puppeteer';

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 10000;

/* ===============================
   ROTA DE STATUS (RENDER)
================================ */
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    service: 'WPPConnect',
    env: 'render'
  });
});

/* ===============================
   INICIA SERVIDOR HTTP
================================ */
app.listen(PORT, () => {
  console.log('🌐 HTTP ativo na porta', PORT);
});

/* ===============================
   INICIA WHATSAPP
================================ */
wppconnect
  .create({
    session: 'render-session',

    catchQR: (qrCode, asciiQR) => {
      console.log('\n📱 ESCANEIE O QR CODE:\n');
      console.log(asciiQR);
    },

    statusFind: (status) => {
      console.log('📡 Status WhatsApp:', status);
    },

    puppeteerOptions: {
      executablePath: puppeteer.executablePath(),
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--no-zygote',
        '--single-process'
      ]
    }
  })
  .then((client) => {
    console.log('✅ WhatsApp conectado');

    /* ===============================
       RECEBE MENSAGENS
    ================================ */
    client.onMessage((msg) => {
      console.log('📩 Mensagem:', msg.from, msg.body);
    });

    /* ===============================
       ENDPOINT ENVIAR MENSAGEM
    ================================ */
    app.post('/send', async (req, res) => {
      try {
        const { number, message } = req.body;

        if (!number || !message) {
          return res.status(400).json({ error: 'number e message obrigatórios' });
        }

        const chatId = number.includes('@c.us')
          ? number
          : `${number}@c.us`;

        await client.sendText(chatId, message);

        res.json({
          success: true,
          to: chatId,
          message
        });
      } catch (err) {
        console.error('❌ Erro ao enviar:', err);
        res.status(500).json({ error: 'Falha ao enviar mensagem' });
      }
    });
  })
  .catch((err) => {
    console.error('❌ ERRO WPPConnect:', err);
  });
