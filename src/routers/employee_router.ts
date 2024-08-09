import express, { Request, Response } from "express";
import pool from "../database/database_pool";
const employeeRouter: express.Router = express.Router();
employeeRouter.get("/get_all", async (req: Request, res: Response) => {
  try {
    const query_not_deleted = `SELECT * FROM tb_employee WHERE is_deleted=false`;
    const query_deleted = `SELECT * FROM tb_employee WHERE is_deleted=true`;

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

employeeRouter.post("/create_employee", async (req: Request, res: Response) => {
  try {
    const query = `INSERT INTO tb_employee (employee_id,town,city,district,state)VALUES ('${req.body.employee_id}','${req.body.town}','${req.body.city}','${req.body.district}','${req.body.state}')`;
    const result = await pool.query(query);
    res.send({ message: "Employee created succusfully." });
  } catch (err) {
    if (err) {
      console.error(err);
      res.status(500).send("Server Error");
    } else {
      res.send({ message: "Employee created succusfully." });
    }
  }
});
employeeRouter.delete(
  "/delete_employee/:id",
  async (req: Request, res: Response) => {
    try {
      const query = `UPDATE tb_employee SET is_deleted = true WHERE employee_id = '${req.params.id}'`;
      const result = await pool.query(query);
      res.send({ message: "Employee Deleted succusfully." });
    } catch (err) {
      if (err) {
        console.error(err);
        res.status(500).send("Server Error");
      } else {
        res.send({ message: "Employee deleted succusfully." });
      }
    }
  }
);
employeeRouter.delete(
  "/undo_delete_employee/:id",
  async (req: Request, res: any) => {
    try {
      const query = `UPDATE tb_employee SET is_deleted = false WHERE eployee_id = '${req.params.id}'`;
      const result = await pool.query(query);
      res.send({ message: "Employee Redeployed succusfully." });
    } catch (err) {
      if (err) {
        console.error(err);
        res.status(500).send("Server Error");
      } else {
        res.send({ message: "Einance eedeployed succusfully." });
      }
    }
  }
);
employeeRouter.put(
  "/update_employee/:id",
  async (req: Request, res: Response) => {
    const { employee_id, town, city, district, state } = req.body;
    try {
      const query = `UPDATE tb_employee SET town='${town}',city='${city}',district='${district}',state='${state}' WHERE employee_id = '${employee_id}'`;
      const result = await pool.query(query);
      res.send({ message: "Employee Updated succusfully." });
    } catch (err) {
      if (err) {
        console.error(err);
        res.status(500).send("Server Error");
      } else {
        res.send({ message: "Employee Deleted succusfully." });
      }
    }
  }
);

export default employeeRouter;
