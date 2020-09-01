const mailer = require("nodemailer");

const mailerSecret = require("../secret/mailer.secret");

const transporter = mailer.createTransport({
  service: "gmail",
  auth: {
    user: mailerSecret.email,
    pass: mailerSecret.password,
  },
});

let sendMail = async (mailOptions) => {
  let info = await transporter.sendMail(mailOptions);

  if (info.accepted.length >= 1) return { ok: true, info };
  else return { ok: false, info };
};

module.exports = { sendMail };
