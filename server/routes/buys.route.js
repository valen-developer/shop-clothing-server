const express = require("express");
const app = express();

const jwt = require("jsonwebtoken");

const enviroment = require("../secret/env");

const { createBuy } = require("../database/db.buy");

app.post("/api/buy", async (req, resp) => {
  const body = req.body;
  const items = Array.from(body.items);
  const user = body.user;
  const buyToken = jwt.sign(Date.now(), enviroment.token.seed);

  items.forEach(async (item) => {
    const resp = await createBuy(item, user, buyToken);
    //TODO: cazar errores
  });

  resp.json({
    ok: true,
    buyToken,
  });
});

module.exports = app;
