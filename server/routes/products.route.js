const express = require("express");
const app = express();

const { selectProduct, selectProductPriceMax } = require("../database/db");

app.get("/api/products", async (req, resp) => {
  const queries = req.query;
  const type = queries.type;
  let data;
  if (queries.price) {
    data = await selectProductPriceMax(['type', 'price'], [type, queries.price]);
  } else {
    data = await selectProduct("type", type);
  }

  resp.json({
    ok: true,
    data,
    type,
  });
});

module.exports = app;
