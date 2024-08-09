import fs from "fs";
import path from "path";

import pool from "./database/database_pool";
//-----------------------------Database-----------------------------------

const path_database = path.join(__dirname, "./database/create_database.sql");
const sql_database = fs.readFileSync(path_database, "utf-8");

pool
  .query(sql_database)
  .then(() => {
    console.log("Tables created successfully");
    pool.end();
  })
  .catch((err: any) => {
    console.error("Error executing SQL file for db_finance", err);
    pool.end();
  });
