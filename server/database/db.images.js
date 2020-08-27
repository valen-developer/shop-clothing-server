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

let getAllImages = async (productID) => {
  const conn = await pool.getConnection();
  try {
    const data = await conn.query(
      `SELECT * FROM images WHERE product_id='${productID}'`
    );
    conn.release();
    return { ok: true, data };
  } catch (e) {
    conn.release();
    return { ok: false, error: e };
  }
};



let saveImages = async (productName, productId, productType, index) => {
  const conn = await pool.getConnection();
  try {
    const data = await conn.query(
      `INSERT INTO images (urlimage, product_id) ` +
        `VALUES ('uploads/${productName}flag${index}.${productType}.jpg', '${productId}')`
    );
    conn.release();
    return { ok: true, data };
  } catch (e) {
    conn.release();
    return { ok: false, error: e };
  }
};

let deleteAllById = async (id) => {
  const conn = await pool.getConnection();
  try {
    const data = await conn.query(
      `DELETE FROM images WHERE product_id='${id}'`
    );
    conn.release();
    return { ok: true, data };
  } catch (e) {
    console.log(e);
    conn.release();
    return { ok: false, error: e };
  }
};

let countImages = async (id) => {
  const conn = await pool.getConnection();

  try {
    const data = await conn.query(
      `SELECT COUNT(product_id) FROM images WHERE product_id='${id}'`
    );
    conn.release();
    return {
      ok: true,
      data,
    };
  } catch (e) {
    conn.release();
    return { ok: false, error: e };
  }
};

module.exports = {
  saveImages,
  getAllImages,
  deleteAllById,
  countImages,
  
};
