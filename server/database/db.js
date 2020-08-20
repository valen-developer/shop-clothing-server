const dbData = require("../secret/db.secret");
const mariadb = require("mariadb");

const pool = mariadb.createPool({
  host: dbData.host,
  password: dbData.password,
  user: dbData.user,
  database: dbData.database,
});

let getAll = async () => {
  const conn = await pool.getConnection();
  if (conn) {
    try {
      const data = await conn.query(`SELECT * FROM product`);
      conn.end;
      return { ok: true, data };
    } catch (e) {
      conn.end;
      return { ok: false, e };
    }
  }
};

let selectProduct = async (colum, query) => {
  const conn = await pool.getConnection();
  if (conn) {
    try {
      const data = await conn.query(
        `SELECT * FROM product WHERE ${colum}='${query}'`
      );
      conn.end;
      return { ok: true, data };
    } catch (e) {
      console.log(e);
      conn.end;
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
  conn.end;
};

let postProduct = async (product) => {
  const conn = await pool.getConnection();
  try {
    const data = await conn.query(
      `INSERT INTO product (name, type, price, ofert_price, stock, quantity, ofert, urlimage, size, size_cm) VALUES ('${product.name}', '${product.type}', '${product.price}', '${product.ofert_price}', '${product.stock}', '${product.quantity}', '${product.ofert}', '${product.urlimage}', '${product.size}', '${product.size_cm}')`
    );

    return { ok: true, data };
  } catch (e) {
    return { ok: false, e };
  }
  conn.end;
};

module.exports = {
  selectProduct,
  selectProductPriceMax,
  postProduct,
  getAll,
};
