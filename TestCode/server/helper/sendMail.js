const nodemailer = require('nodemailer');

module.exports = async (email, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.HOST,
      service: process.env.SERVICE,
      port: Number(process.env.EMAIL_PORT),
      secure: Boolean(process.env.SECURE),
      auth: {
        user: 'helloworldsout333@gmail.com',
        pass: 'Power@123',
      },
    });

    await transporter.sendMail({
      from: 'helloworldsout333@gmail.com',
      to: email,
      subject: subject,
      text: text,
    });
    console.log('email sent successfully');
    return true;
  } catch (error) {
    console.log('email not sent!');
    console.log(error);
    return error;
  }
};