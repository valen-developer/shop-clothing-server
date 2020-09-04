const express = require("express");
const app = express();

const jwt = require("jsonwebtoken");

const enviroment = require("../secret/env");

const {
  createBuy,
  updatePaypalID,
  getByBuyToken,
} = require("../database/db.buy");

app.get("/api/buy", async (req, resp) => {
  const buyToken = req.query.buyToken;

  const dataDB = await getByBuyToken(buyToken);

  resp.json({
    ok: true,
    paypalID: dataDB.paypal_id,
  });
});

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

app.put("/api/buy/paypalID", async (req, resp) => {
  const buyID = req.body.buyID;
  const buyToken = req.body.buyToken;

  const dataDB = await updatePaypalID(buyID, buyToken);
  //TODO: cazar errores

  resp.json({
    ok: true,
  });
});

module.exports = app;
