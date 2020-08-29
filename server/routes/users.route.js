const express = require("express");
const app = express();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { createUser, getUserByEmail } = require("../database/db.users");
const {
  verifyUserToken,
  verifyRole,
} = require("../middlewares/auth.middleware");

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

  const userDB = (await getUserByEmail(email)).data[0];

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
