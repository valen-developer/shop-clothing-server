const express = require("express");
const app = express();

const {
  createPayment,
  getPaymentByUserID,
} = require("../database/db.payments");

app.get("/api/payment", async (req, resp) => {
  const userID = req.query.userID;

  try {
    const dataDB = await getPaymentByUserID(userID);
    resp.json({
      response: dataDB,
    });
  } catch (error) {
    resp.json({
      data: {
        ok: false,
        error,
      },
    });
  }
});

app.post("/api/payment", async (req, resp) => {
  const paymentData = req.body;

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
