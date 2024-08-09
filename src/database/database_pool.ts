const { Pool } = require("pg");
const pool = new Pool({
  user: "postgres",
  password: "root",
  host: "localhost",
  port: 5432, // default Postgres port
  database: "db_finance",
});
export default pool;
