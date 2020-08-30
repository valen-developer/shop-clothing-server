const mailer = require("nodemailer");

const mailerSecret = require("../secret/mailer.secret");

const transporter = mailer.createTransport({
  service: "gmail",
  auth: {
    user: mailerSecret.email,
    pass: mailerSecret.password,
  },
});

let sendMail = (mailOptions) => {
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) console.log(err);
    else console.log(info);
  });
};

module.exports = { sendMail };
