import nodemailer from 'nodemailer';

async function testGmail() {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'wilmer7522@gmail.com',
      pass: 'npyhlgalzpcipsom'
    }
  });

  try {
    const info = await transporter.sendMail({
      from: '"Moto-X Cult" <wilmer7522@gmail.com>',
      to: 'wilmer752@gmail.com',
      subject: 'Prueba Código de Recuperación Moto-X Cult 🔐',
      text: 'Tu código de prueba es 849201',
      html: '<b>Tu código de prueba es 849201</b>'
    });
    console.log('✅ Correo enviado con éxito. Message ID:', info.messageId);
  } catch (err) {
    console.error('❌ Error enviando correo:', err);
  }
}

testGmail();
