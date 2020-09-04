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

let getAll = async () => {
  const conn = await pool.getConnection();
  try {
    const data = await conn.query("SELECT * FROM buys");
    console.log(data);
    conn.release();
  } catch (error) {
    console.log(error);
    conn.release();
  }
};

let getAllByUserID = async (userID) => {
  const conn = await pool.getConnection();
  try {
    const data = await conn.query(
      `SELECT * FROM buys WHERE user_id='${userID}'`
    );

    console.log(data);
    conn.release();
    return data;
  } catch (error) {
    conn.release();
    console.log(error);
    return error;
  }
};

let getByBuyToken = async (buyToken) => {
  const conn = await pool.getConnection();
  try {
    const data = await conn.query(
      `SELECT paypal_id FROM buys WHERE buy_token='${buyToken}'`
    );
    conn.release();
    return data[0];
  } catch (error) {
    conn.release();
    console.log(error);
  }
};

let createBuy = async (item, user, buyToken, date) => {
  const conn = await pool.getConnection();
  try {
    const data = await conn.query(
      `INSERT INTO buys (date, product_id, user_id, size, quantity, buy_token) ` +
        `VALUES ('${date}', '${item.product.id}', '${user.id}', '${item.size}', '${item.quantity}', '${buyToken}')`
    );
    conn.release();
    return { ok: true, data };
  } catch (error) {
    console.log(error);
    conn.release();
    return { ok: false, error };
  }
};

let updatePaypalID = async (buyID, buyToken) => {
  const conn = await pool.getConnection();
  try {
    const data = await conn.query(
      `UPDATE buys SET paypal_id='${buyID}' WHERE buy_token='${buyToken}'`
    );
    conn.release();
  } catch (error) {
    console.log(error);
    conn.release();
  }
};

module.exports = {
  getAll,
  getByBuyToken,
  getAllByUserID,
  createBuy,
  updatePaypalID,
};
