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
  if (conn) {
    try {
      const data = await conn.query(`SELECT * FROM product`);
      conn.release();
      return { ok: true, data };
    } catch (e) {
      conn.release();
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
      conn.release();
      return { ok: true, data };
    } catch (e) {
      console.log(e);
      conn.release();
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
      conn.release();
      return { ok: true, data };
    } catch (e) {
      conn.release();
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
    conn.release();
    return { ok: true, data };
  } catch (e) {
    conn.release();
    return { ok: false, e };
  }
};

let deleteProduct = async (id) => {
  const conn = await pool.getConnection();
  try {
    const data = await conn.query(`DELETE FROM product WHERE id='${id}'`);
    conn.release();
    return { ok: true, data };
  } catch (e) {
    console.log(e);
    conn.release();
    return { ok: false, error: e };
  }
};

let updateProduct = async (product) => {
  const conn = await pool.getConnection();
  try {
    const data = await conn.query(
      `UPDATE product SET name='${product.name}', ` +
        `price='${product.price}', ` +
        `ofert_price='${product.ofert_price}', ` +
        `stock='${product.stock}', ` +
        `ofert='${product.ofert}', ` +
        `size='${product.size}', ` +
        `size_cm='${product.size_cm}', ` +
        `urlimage='${product.urlimage}' ` +
        `WHERE id='${product.id}'`
    );
  } catch (e) {
    console.log(e);
  }
};

module.exports = {
  selectProduct,
  selectProductPriceMax,
  postProduct,
  getAll,
  deleteProduct,
  updateProduct,
};
