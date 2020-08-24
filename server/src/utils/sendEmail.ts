import nodemailer from 'nodemailer';

export async function sendEmail(to: string, html: string) {
  let transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: 'xyivrznhdyfyvnuf@ethereal.email',
      pass: 'MqeZsURXeqmG69P9xz',
    },
  });

  let info = await transporter.sendMail({
    from: '"Fred Foo 👻" <foo@example.com>',
    to: to,
    subject: 'Forgot password?',
    html: html,
  });

  console.log('Message sent: %s', info.messageId);
  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
}
