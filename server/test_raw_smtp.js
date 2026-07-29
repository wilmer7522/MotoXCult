import tls from 'node:tls';

async function sendGmail({ user, pass, to, subject, html }) {
  return new Promise((resolve, reject) => {
    const socket = tls.connect(465, 'smtp.gmail.com', () => {
      let step = 0;
      let log = '';

      const send = (cmd) => {
        socket.write(cmd + '\r\n');
      };

      socket.on('data', (data) => {
        const msg = data.toString();
        log += msg;

        if (step === 0 && msg.startsWith('220')) {
          step = 1;
          send('EHLO motoxcult.com');
        } else if (step === 1 && msg.startsWith('250')) {
          step = 2;
          send('AUTH LOGIN');
        } else if (step === 2 && msg.startsWith('334')) {
          step = 3;
          send(Buffer.from(user).toString('base64'));
        } else if (step === 3 && msg.startsWith('334')) {
          step = 4;
          send(Buffer.from(pass).toString('base64'));
        } else if (step === 4 && msg.startsWith('235')) {
          step = 5;
          send(`MAIL FROM:<${user}>`);
        } else if (step === 5 && msg.startsWith('250')) {
          step = 6;
          send(`RCPT TO:<${to}>`);
        } else if (step === 6 && msg.startsWith('250')) {
          step = 7;
          send('DATA');
        } else if (step === 7 && msg.startsWith('354')) {
          step = 8;
          const mime = [
            `From: "Moto-X Cult" <${user}>`,
            `To: <${to}>`,
            `Subject: =?UTF-8?B?${Buffer.from(subject).toString('base64')}?=`,
            'MIME-Version: 1.0',
            'Content-Type: text/html; charset=utf-8',
            '',
            html,
            '.'
          ].join('\r\n');
          send(mime);
        } else if (step === 8 && msg.startsWith('250')) {
          step = 9;
          send('QUIT');
          resolve(true);
        }
      });

      socket.on('error', (err) => reject(err));
      socket.on('close', () => {
        if (step < 8) reject(new Error('SMTP connection closed: ' + log));
      });
    });
  });
}

sendGmail({
  user: 'wilmer7522@gmail.com',
  pass: 'npyhlgalzpcipsom',
  to: 'wilmer752@gmail.com',
  subject: 'Prueba Gmail Directo Moto-X Cult 🔐',
  html: '<h1>Tu código es 999888</h1>'
}).then(() => console.log('✅ Correo enviado por SMTP TLS directo!'))
  .catch(err => console.error('❌ Error:', err));
