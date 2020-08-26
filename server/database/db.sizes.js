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
    conn.release();
    return data;
  } catch (e) {
    conn.release();
    return { error: e };
  }
};

let postSizes = async (size, quantity, prodcutID) => {
  const conn = await pool.getConnection();
  try {
    const data = await conn.query(
      `INSERT INTO sizes (size, product_id, quantity) ` +
        `VALUES ('${size}', '${prodcutID}', '${quantity}')`
    );
    conn.release();
    return { ok: true, data };
  } catch (error) {
    conn.release();
    return { ok: false, error };
  }
};

let deleteSizesById = async (id)=>{
  const conn = await pool.getConnection();
  try {
    const dataSize = await conn.query(`DELETE FROM sizes WHERE product_id='${id}'`);
    conn.release();
  } catch (error) {
    
  }
}

module.exports = { getSizesByID, postSizes, deleteSizesById  };
