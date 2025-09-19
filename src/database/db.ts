import db from "mysql2/promise";

export const configDb = db.createPool({
  host: "localhost",
  user: "root",
  password: "F@bric465#1",
  database: "anime_app_db",
});
