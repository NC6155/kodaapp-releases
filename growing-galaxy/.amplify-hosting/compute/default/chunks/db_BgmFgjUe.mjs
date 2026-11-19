import { Pool } from "pg";
//#region src/lib/db.ts
var db = new Pool({
	host: process.env.DB_HOST,
	port: Number(process.env.DB_PORT || 5432),
	database: process.env.DB_NAME,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD
});
//#endregion
export { db as t };
