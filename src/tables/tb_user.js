"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const { Pool } = require("pg");
const pool = new Pool({
    user: "postgres",
    password: "root",
    host: "localhost",
    port: 5432, // default Postgres port
    database: "db_finance",
});
const create_tb_user = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield pool.query("CREATE TABLE tb_user(id SERIAL ,user_name TEXT PRIMARY KEY,password TEXT,is_deleted BOOLEAN DEFAULT false)");
    }
    catch (err) {
        console.error(err);
    }
});
exports.default = create_tb_user;
