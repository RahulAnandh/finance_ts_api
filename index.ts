// Importing module
var express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");
const { Pool } = require("pg");
const { Router } = require("express");
const jwt = require("jsonwebtoken");
require("crypto").randomBytes(64).toString("hex");

const app = express();
// const taskRouter = Router();
const router = express.Router();
const PORT: Number = 3000;
const TOKEN_SECRET = "my_rahul_key";

const pool = new Pool({
  user: "postgres",
  password: "root",
  host: "localhost",
  port: 5432, // default Postgres port
  database: "db_finance",
});

app.use(bodyParser.json());
app.use(cors());

function generateAccessToken(username: any) {
  return jwt.sign(username, TOKEN_SECRET, { expiresIn: "1800s" });
}
function authenticateToken(req: any, res: any, next: any) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, TOKEN_SECRET, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}
// Handling GET / Request
app.get("/", (req: any, res: any) => {
  res.send("Welcome to typescript backend!");
});

app.post("/api/v1/login/create_table", async (req: any, res: any) => {
  console.log("request", req.body);
  try {
    const result = await pool.query(
      "CREATE TABLE tb_user(id SERIAL ,user_name TEXT PRIMARY KEY,password TEXT,is_deleted BOOLEAN DEFAULT false)"
    );
    res.send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
  res.send({ is_number_exist: true });
});
app.post("/api/v1/login/is_number_exist", async (req: any, res: any) => {
  try {
    const query = `SELECT * FROM tb_user WHERE user_name = '${req.body.mobile}'`;
    const result = await pool.query(query);
    console.log(result.rows.length);
    if (result.rows.length > 0) {
      res.send({ is_number_exist: true });
    } else {
      res.send({ is_number_exist: false });
    }
  } catch (err) {
    if (err) {
      console.error(err);
      res.status(500).send("Server Error");
    } else {
    }
  }
});
app.post("/api/v1/login/create_user", async (req: any, res: any) => {
  try {
    const query = `INSERT INTO tb_user (user_name, password)VALUES ('${req.body.user_name}','${req.body.password}')`;
    const result = await pool.query(query);
    res.send({ message: "User created succusfully." });
  } catch (err) {
    if (err) {
      console.error(err);
      res.status(500).send("Server Error");
    } else {
      res.send({ message: "User created succusfully." });
    }
  }
});
app.post("/api/v1/login/otp_verification", async (req: any, res: any) => {
  console.log("1---A", req.body);
  try {
    const query = `SELECT * FROM tb_user WHERE user_name = '${req.body.mobile}'`;
    const result = await pool.query(query);
    console.log(result.rows.length);
    if (result.rows.length > 0 && req.body.otp === "123456") {
      const token = generateAccessToken({ user_name: req.body.mobile });
      res.send({ is_logged_in: true, token: token, type: "admin" });
    } else {
      res.send({ is_logged_in: false });
    }
  } catch (err) {
    if (err) {
      console.error(err);
      res.status(500).send("Server Error");
    } else {
    }
  }
});

// Server setup
app.listen(PORT, () => {
  console.log(
    "The application is listening " + "on port http://localhost:" + PORT
  );
});

module.exports = router;

// export default router;
