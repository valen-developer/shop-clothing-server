const dbData = require("../secret/db.secret");
const mariadb = require("mariadb");

const pool = mariadb.createPool({
  host: dbData.host,
  password: dbData.password,
  user: dbData.user,
  database: dbData.database,
});

let selectProduct = async (colum, query) => {
  const conn = await pool.getConnection();
  if (conn) {
    try {
      const data = await conn.query(
        `SELECT * FROM product WHERE ${colum}='${query}'`
      );
      return { ok: true, data };
    } catch (e) {
      return { ok: false, e };
    }
  }
};

let selectProductPriceMax = async ([typeColum, priceColum], [type, price]) => {
  const conn = await pool.getConnection();
  if (conn) {
    try {
      const data = await conn.query(
        `SELECT * FROM product WHERE ${typeColum}='${type}' AND ${priceColum}<='${price}'`
      );
      return { ok: true, data };
    } catch (e) {
      return {
        ok: false,
        e,
      };
    }
  }
};

module.exports = {
  selectProduct,
  selectProductPriceMax,
};
