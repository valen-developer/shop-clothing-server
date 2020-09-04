const dbData = require("../secret/db.secret");
const mariadb = require("mariadb");

const pool = mariadb.createPool({
  host: dbData.host,
  password: dbData.password,
  user: dbData.user,
  database: dbData.database,
  acquireTimeout: 20,
  connectTimeout: 0,
});

let createPayment = async (paymentData) => {
  const conn = await pool.getConnection();
  try {
    const dataDB = await conn.query(
      `INSERT INTO payments (amount, state, user_id, buy_token, paypal_id) ` +
        `VALUES ('${paymentData.paymentAmount}','${paymentData.state}','${paymentData.userID}', ` +
        `'${paymentData.buyToken}','${paymentData.paypalID}')`
    );
    conn.release();
    return { ok: true };
  } catch (error) {
    conn.release();
    console.log(error);
    return { ok: false, error };
  }
};

module.exports = { createPayment };
