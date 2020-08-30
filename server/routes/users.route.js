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
app.post("/users/register", [verifyUserToken], async (req, resp) => {
  // Set body an encrypt password
  const body = req.body;
  body.password = bcrypt.hashSync(body.password, 10);

  const dataFromDB = await createUser(body);

  resp.json({
    ok: true,
    dataFromDB,
  });
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
  resp.json({
    ok: true,
  });
});

module.exports = app;
