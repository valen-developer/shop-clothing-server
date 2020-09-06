const dbData = require("../secret/db.secret");
const mariadb = require("mariadb");
const { user } = require("../secret/db.secret");

const pool = mariadb.createPool({
  host: dbData.host,
  password: dbData.password,
  user: dbData.user,
  database: dbData.database,
  acquireTimeout: 20,
  connectTimeout: 0,
});

let getPaymentByUserID = async (userID) => {
  const conn = await pool.getConnection();
  try {
    const data = await conn.query(
      `SELECT * FROM payments WHERE user_id='${userID}'`
    );
    conn.release();
    return { ok: true, data };
  } catch (error) {
    conn.release();
    return { ok: false, error };
  }
};

let createPayment = async (paymentData, date) => {
  const conn = await pool.getConnection();
  try {
    const dataDB = await conn.query(
      `INSERT INTO payments (amount, state, user_id, buy_token, paypal_id, date) ` +
        `VALUES ('${paymentData.paymentAmount}','${paymentData.state}','${paymentData.userID}', ` +
        `'${paymentData.buyToken}','${paymentData.paypalID}', '${date}')`
    );
    conn.release();
    return { ok: true };
  } catch (error) {
    conn.release();
    console.log(error);
    return { ok: false, error };
  }
};

module.exports = { createPayment, getPaymentByUserID };
