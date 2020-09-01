const dbData = require("../secret/db.secret");
const mariadb = require("mariadb");
const { response } = require("../routes/users.route");

const pool = mariadb.createPool({
  host: dbData.host,
  password: dbData.password,
  user: dbData.user,
  database: dbData.database,
  acquireTimeout: 20,
  connectTimeout: 0,
});

let createUser = async (user) => {
  const conn = await pool.getConnection();

  try {
    const data = await conn.query(
      `INSERT INTO users(name, email, password, addr, role) ` +
        `VALUES ('${user.name}','${user.email}', '${user.password}', ` +
        `'${user.addr}', '${user.role ? user.role : "USER_ROLE"}')`
    );
    conn.release();
    return { ok: true, data };
  } catch (error) {
    conn.release();
    return { ok: false, error };
  }
};

let getUserByEmail = async (email) => {
  const conn = await pool.getConnection();

  try {
    const data = await conn.query(`SELECT * FROM users WHERE email='${email}'`);
    conn.release();
    return { ok: true, data };
  } catch (error) {
    conn.release();
    return { ok: false, error };
  }
};

module.exports = { createUser, getUserByEmail };
