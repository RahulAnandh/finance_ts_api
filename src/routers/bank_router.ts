import express, { Request, Response } from "express";
import pool from "../database/database_pool";
const bankRouter: express.Router = express.Router();
bankRouter.get("/get_all", async (req: Request, res: Response) => {
  try {
    const query_not_deleted = `SELECT * FROM tb_bank WHERE is_deleted=false`;
    const query_deleted = `SELECT * FROM tb_bank WHERE is_deleted=true`;

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

bankRouter.post("/create_bank", async (req: Request, res: Response) => {
  try {
    const query = `INSERT INTO tb_bank (acc_no,bank_name,ifsc,branch,acc_hol,acc_type,town,city,district,bank_state)VALUES ('${req.body.acc_no}','${req.body.bank_name}','${req.body.ifsc}','${req.body.branch}','${req.body.acc_hol}','${req.body.acc_type}','${req.body.town}','${req.body.city}','${req.body.district}','${req.body.bank_state}')`;
    const result = await pool.query(query);
    res.send({ message: "Bank created succusfully." });
  } catch (err) {
    if (err) {
      console.error(err);
      res.status(500).send("Server Error");
    } else {
      res.send({ message: "Bank created succusfully." });
    }
  }
});
bankRouter.delete("/delete_bank/:id", async (req: Request, res: Response) => {
  console.log("1---2", req.params);

  try {
    const query = `UPDATE tb_bank SET is_deleted = true WHERE id = '${req.params.id}'`;
    const result = await pool.query(query);
    res.send({ message: "Bank Deleted succusfully." });
  } catch (err) {
    if (err) {
      console.error(err);
      res.status(500).send("Server Error");
    } else {
      res.send({ message: "Bank Deleted succusfully." });
    }
  }
});
bankRouter.delete("/undo_delete_bank/:id", async (req: Request, res: any) => {
  console.log("1---2", req.params);
  try {
    const query = `UPDATE tb_bank SET is_deleted = false WHERE id = '${req.params.id}'`;
    const result = await pool.query(query);
    res.send({ message: "Bank Redeployed succusfully." });
  } catch (err) {
    if (err) {
      console.error(err);
      res.status(500).send("Server Error");
    } else {
      res.send({ message: "Bank Redeployed succusfully." });
    }
  }
});
bankRouter.put("/update_bank/:id", async (req: Request, res: Response) => {
  const {
    id,
    ifsc,
    acc_hol,
    acc_no,
    acc_type,
    bank_name,
    town,
    city,
    district,
    bank_state,
  } = req.body;
  try {
    const query = `UPDATE tb_bank SET town='${town}',ifsc='${ifsc}',acc_hol='${acc_hol}',acc_no='${acc_no}',acc_type='${acc_type}',bank_name='${bank_name}',city='${city}',district='${district}',bank_state='${bank_state}' WHERE id = '${req.params.id}'`;
    const result = await pool.query(query);
    res.send({ message: "Bank Updated succusfully." });
  } catch (err) {
    if (err) {
      console.error(err);
      res.status(500).send("Server Error");
    } else {
      res.send({ message: "Bank Deleted succusfully." });
    }
  }
});

export default bankRouter;
