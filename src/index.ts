// Importing module
import express, { Request, Response } from "express";
import bodyParser from "body-parser";
require("crypto").randomBytes(64).toString("hex");
import financeRouter from "./routers/finance_router";
import bankRouter from "./routers/bank_router";

var cors = require("cors");
const { Pool } = require("pg");
const { Router } = require("express");
const jwt = require("jsonwebtoken");

const app: express.Application = express();
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

app.post(
  "/api/v1/login/is_number_exist",
  async (req: Request, res: Response) => {
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
  }
);

app.post(
  "/api/v1/login/otp_verification",
  async (req: Request, res: Response) => {
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
  }
);
app.use("/api/v1/finance", financeRouter);
app.use("/api/v1/bank", bankRouter);

// Server setup
app.listen(PORT, () => {
  console.log(
    "The application is listening " + "on port http://localhost:" + PORT
  );
});

module.exports = router;

// export default router;
