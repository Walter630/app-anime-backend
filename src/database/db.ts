import db from "mysql2/promise";

export const configDb = db.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "animestestdb",
});
