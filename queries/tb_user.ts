const { Pool } = require("pg");
const pool = new Pool({
  user: "postgres",
  password: "root",
  host: "localhost",
  port: 5432, // default Postgres port
  database: "db_finance",
});
const crete_tb_user = async () => {
  try {
    const result = await pool.query(
      "CREATE TABLE tb_user (id SERIAL ,user_name TEXT PRIMARY KEY,password TEXT,is_deleted BOOLEAN DEFAULT false)"
    );
  } catch (err) {
    console.error(err);
  }
};

module.exports = crete_tb_user;
