const express = require("express");
const app = express();

const { createPayment } = require("../database/db.payments");

app.post("/api/payment", async (req, resp) => {
  const paymentData = req.body;
  console.log(paymentData);

  const dataDB = await createPayment(paymentData);

  if (dataDB.ok) {
    return resp.json({
      ok: true,
    });
  }

  resp.status(500).json({
    ok: false,
    error: dataDB.error,
  });
});

module.exports = app;
