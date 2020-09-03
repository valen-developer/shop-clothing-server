const express = require("express");
const app = express();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { createUser, getUserByEmail } = require("../database/db.users");
const { verifyUserToken } = require("../middlewares/auth.middleware");

const mailer = require("../secret/mailer.secret");
const { sendMail } = require("../utils/mailer");

const enviroment = require("../secret/env");

//Create new user
app.post("/users/register", async (req, resp) => {
  // Set body an encrypt password
  const body = req.body;
  body.password = bcrypt.hashSync(body.password, 10);

  const userData = {
    email: body.email,
    password: body.password,
  };

  // generate token
  const tokenRegister = jwt.sign(userData, enviroment.token.seed, {
    expiresIn: enviroment.token.exp,
  });
  const webRedicrect = `http://localhost:3000/checkregister/${tokenRegister}`;

  //Send email with token
  const mailOptions = {
    from: mailer.email,
    to: userData.email,
    subject: "Registro web",
    html:
      `<h1 style="color: red;" >Pulsa en el siguiente enlace para confirmar tu email</h1> ` +
      `<a href="${webRedicrect}">Confirmar mi email</a>`,
  };
  const dataMail = await sendMail(mailOptions);

  resp.json(dataMail);
});

app.get("/users/checkregister", [verifyUserToken], async (req, resp) => {
  const decodedPayload = jwt.decode(req.headers.token);
  const user = {
    email: decodedPayload.email,
    password: decodedPayload.password,
  };

  const dataDB = await createUser(user);
  if (dataDB.ok) return resp.json({ ok: true, user });
  else
    return resp.json({ ok: false, error: "No se ha podido crear el usuario" });
});

app.post("/users/login", async (req, resp) => {
  const body = req.body;
  const email = body.email;
  const password = body.password;

  const dataDB = await getUserByEmail(email);

  if (!dataDB.ok)
    return resp
      .status(400)
      .json({ ok: false, error: "Usuario o contraseña incorrectos" });

  const userDB = dataDB.data[0];

  if (!bcrypt.compareSync(password, userDB.password)) {
    return resp.status(400).json({
      ok: false,
      error: "User or Email incorrect",
    });
  }

  // Save password and Generate token
  delete userDB.password;
  const token = jwt.sign(userDB, enviroment.token.seed, {
    expiresIn: enviroment.token.exp,
  });

  const mensaje = "Un mensaje";

  const mailOption = {
    from: mailer.email,
    to: "valenreta@gmail.com",
    subject: "Un asunto desde la pagina",
    html: `<h1>${mensaje}</h1> <a href="http://localhost:3000/home">Ir a la web</a>`,
  };

  sendMail(mailOption);

  resp.json({
    ok: true,
    userDB,
    token,
  });
});

app.get("/users/logged", verifyUserToken, (req, resp) => {
  const user = jwt.decode(req.headers.token);

  resp.json({
    ok: true,
    user,
  });
});

module.exports = app;
