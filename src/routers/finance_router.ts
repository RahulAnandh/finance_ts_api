import express, { Request, Response } from "express";
import pool from "../database/database_pool";
const financeRouter: express.Router = express.Router();
financeRouter.get("/get_all", async (req: Request, res: Response) => {
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

financeRouter.post("/create_finance", async (req: Request, res: Response) => {
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
financeRouter.delete(
  "/delete_finance/:id",
  async (req: Request, res: Response) => {
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
  }
);
financeRouter.delete(
  "/undo_delete_finance/:id",
  async (req: Request, res: any) => {
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
financeRouter.put(
  "/update_finance/:id",
  async (req: Request, res: Response) => {
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
  }
);

export default financeRouter;
