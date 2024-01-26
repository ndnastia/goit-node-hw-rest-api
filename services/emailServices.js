const nodemailer = require('nodemailer');
const path = require('path');
const pug = require('pug');
const { convert } = require('html-to-text');

const { serverConfig } = require('../configs/serverConfig');

class Email {
  constructor(user, url) {
    this.to = user.email;
    this.name = user.name;
    this.url = url;
    this.from = serverConfig.emailFrom;
  }


  _initTransport() {

      return nodemailer.createTransport({
        
        host: 'smtp.mailgun.org',
        port: 587,
        auth: {
          user: serverConfig.mailgunUser,
          pass: serverConfig.mailgunPasswd,
        },
      });
  }

  async _send(template, subject) {
    const html = pug.renderFile(path.join(__dirname, '..', 'views', 'emails', `verifyEmail.pug`), {
      name: this.name,
      url: this.url,
      subject,
    });

    const emailConfig = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: convert(html),
    };

    await this._initTransport().sendMail(emailConfig);
  }

  async sendVerificationToken() {
    await this._send('Verify Email', 'Verification Token');
  }

}

module.exports = Email;

