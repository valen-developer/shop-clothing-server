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

let getSizesByID = async (id) => {
  const conn = await pool.getConnection();
  try {
    const data = await conn.query(
      `SELECT * FROM sizes WHERE product_id='${id}'`
    );
    return data;
  } catch (e) {
    return { error: e };
  }
};

module.exports = { getSizesByID };
