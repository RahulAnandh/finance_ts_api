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

app.get("/api/v1/login/create_table", async (req: any, res: any) => {
  try {
    // const tb_user = await pool.query(
    //   "CREATE TABLE tb_user(id SERIAL ,user_name TEXT PRIMARY KEY,password TEXT,is_deleted BOOLEAN DEFAULT false)"
    // );
    // const tb_finance = await pool.query(
    //   "CREATE TABLE tb_finance(id SERIAL ,finance_id TEXT PRIMARY KEY,town TEXT,city TEXT,district TEXT,state TEXT,is_deleted BOOLEAN DEFAULT false)"
    // );
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
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
app.get("/api/v1/finance/get_all", async (req: any, res: any) => {
  try {
    const query_not_deleted = `SELECT * FROM tb_finance WHERE is_deleted=false`;
    const query_deleted = `SELECT * FROM tb_finance WHERE is_deleted=true`;

    const result_not_deleted = await pool.query(query_not_deleted);
    const result_deleted = await pool.query(query_deleted);

    res.send({
      not_deleted: result_not_deleted.rows,
      deleted: result_deleted.rows,
    });
  } catch (err) {
    if (err) {
      console.error(err);
      res.status(500).send("Server Error");
    } else {
      res.send({ message: "Server issue" });
    }
  }
});

app.post("/api/v1/finance/create_finance", async (req: any, res: any) => {
  try {
    const query = `INSERT INTO tb_finance (finance_id,town,city,district,state)VALUES ('${req.body.finance_id}','${req.body.town}','${req.body.city}','${req.body.district}','${req.body.state}')`;
    const result = await pool.query(query);
    res.send({ message: "Finance created succusfully." });
  } catch (err) {
    if (err) {
      console.error(err);
      res.status(500).send("Server Error");
    } else {
      res.send({ message: "Finance created succusfully." });
    }
  }
});
app.delete("/api/v1/finance/delete_finance/:id", async (req: any, res: any) => {
  try {
    const query = `UPDATE tb_finance SET is_deleted = true WHERE finance_id = '${req.params.id}'`;
    const result = await pool.query(query);
    res.send({ message: "Finance Deleted succusfully." });
  } catch (err) {
    if (err) {
      console.error(err);
      res.status(500).send("Server Error");
    } else {
      res.send({ message: "Finance Deleted succusfully." });
    }
  }
});
app.delete(
  "/api/v1/finance/undo_delete_finance/:id",
  async (req: any, res: any) => {
    try {
      const query = `UPDATE tb_finance SET is_deleted = false WHERE finance_id = '${req.params.id}'`;
      const result = await pool.query(query);
      res.send({ message: "Finance Redeployed succusfully." });
    } catch (err) {
      if (err) {
        console.error(err);
        res.status(500).send("Server Error");
      } else {
        res.send({ message: "Finance Redeployed succusfully." });
      }
    }
  }
);
app.put("/api/v1/finance/update_finance/:id", async (req: any, res: any) => {
  const { finance_id, town, city, district, state } = req.body;
  try {
    const query = `UPDATE tb_finance SET town='${town}',city='${city}',district='${district}',state='${state}' WHERE finance_id = '${finance_id}'`;
    const result = await pool.query(query);
    res.send({ message: "Finance Updated succusfully." });
  } catch (err) {
    if (err) {
      console.error(err);
      res.status(500).send("Server Error");
    } else {
      res.send({ message: "Finance Deleted succusfully." });
    }
  }
});
app.post("/api/v1/login/otp_verification", async (req: any, res: any) => {
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
