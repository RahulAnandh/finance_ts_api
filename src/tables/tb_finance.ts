const { Pool } = require("pg");
const pool = new Pool({
  user: "postgres",
  password: "root",
  host: "localhost",
  port: 5432, // default Postgres port
  database: "db_finance",
});
const create_tb_finance = async () => {
  try {
    const result = await pool.query(
      "CREATE TABLE tb_finance (id SERIAL ,finance_id TEXT PRIMARY KEY,town TEXT,city TEXT,district TEXT,state TEXT,is_deleted BOOLEAN DEFAULT false)"
    );
  } catch (err) {
    console.error(err);
  }
};

export default create_tb_finance;
