const path = require('path');
const nodemailer = require('nodemailer');
const ejs = require('ejs');

module.exports = class Email {
  constructor(user, data) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.from = `Pheity <${process.env.SENDER_EMAIL}>`;
    this.data = data;
  }

  newTransport() {
    return nodemailer.createTransport({
      // service: 'gmail',
      // auth: {
      //   user: process.env.SENDER_EMAIL,
      //   pass: process.env.SENDER_PASSWORD
      // }

      host: 'smtp.mailtrap.io',
      port: 2525,
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS
      }
    });
  }

  async send(template, subject) {
    const html = await ejs.renderFile(
      path.join(__dirname, '..', 'views', `${template}.ejs`),
      {
        firstName: this.firstName,
        templateData: this.data
      }
    );
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html
    };
    await this.newTransport().sendMail(mailOptions, err => {
      if (err) return console.log(err);
      console.log('Email sent successfully');
    });
  }

  async approveAppointment() {
    await this.send('approved', 'Booking Appointment Approved');
  }

  async declineAppointment() {
    await this.send('declined', 'Booking Appointment Declined');
  }
};

// const transporter = nodemailer.createTransport({
// service: 'gmail',
// auth: {
//   user: process.env.SENDER_EMAIL,
//   pass: process.env.SENDER_PASSWORD
// }
// });

//   const transporter = nodemailer.createTransport({
//     host: 'smtp.mailtrap.io',
//     port: 2525,
//     auth: {
//       user: process.env.MAILTRAP_USER,
//       pass: process.env.MAILTRAP_PASS
//     }
//   });

//   const data = await ejs.renderFile(
//     path.join(__dirname, '..', 'views/emailTemplate.ejs'),
//     { visitor, bookTime, bookDate }
//   );

//   const mailOptions = {
//     from: `Pheity<${process.env.DATABASE_EMAIL}>`,
//     to: visitor.email,
//     subject: 'Booking Appointment Approved',
//     html: data
//   };

//   transporter.sendMail(mailOptions, err => {
//     if (err) return console.log(err);
//     console.log('Email sent successfully ');
//   });
