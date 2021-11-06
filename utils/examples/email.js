const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');

// new Email(toEmail, emailData).sendEmail();
// returns true if sent, false if not sent

module.exports = class Email {
  constructor(toEmail, emailData) {
    this.to = toEmail;
    this.data = emailData;
    this.from = `Aberrations RPG <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      // Sendgrid
      return nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD,
        },
      });
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async send(template, subject) {
    // Send the actual email
    // 1 - Render HTML based on a pug template
    const html = pug.renderFile(`${__dirname}/../views/emails/${template}.pug`, {
      data: this.data,
      subject,
    });

    // 2 - Define the email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.fromString(html),
    };

    // 3 - Create a transport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendNotificationEmail() {
    try {
      await this.send('notification', 'Aberrations RPG Notification: A new account has been created');
      return true;
    } catch (err) {
      console.log(err.message);
      return false;
    }
  }

  async sendConfirmEmail() {
    try {
      await this.send('confirmEmail', 'Please confirm your email address...');
      return true;
    } catch (err) {
      console.log(err.message);
      return false;
    }
  }

  async sendUpdateEmail() {
    try {
      await this.send('updateEmail', 'Please confirm your email update request');
      return true;
    } catch (err) {
      console.log(err.message);
      return false;
    }
  }

  async sendPasswordReset() {
    try {
      await this.send('passwordReset', 'Your password reset token (valid for only 10 minutes)');
      return true;
    } catch (err) {
      console.log(err.message);
      return false;
    }
  }

  async sendActivateSubscription() {
    try {
      await this.send('activateSubscription', 'Almost there! Activate your subscription now');
      return true;
    } catch (err) {
      console.log(err.message);
      return false;
    }
  }
};
