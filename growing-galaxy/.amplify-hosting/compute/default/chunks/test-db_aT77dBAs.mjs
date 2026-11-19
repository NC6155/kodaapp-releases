import { t as __exportAll } from "./rolldown-runtime_BBjsoOtd.mjs";
import { t as db } from "./db_BgmFgjUe.mjs";
//#region src/pages/api/test-db.ts
var test_db_exports = /* @__PURE__ */ __exportAll({ GET: () => GET });
var GET = async () => {
	try {
		const result = await db.query("SELECT NOW()");
		return new Response(JSON.stringify({
			conectado: true,
			fecha: result.rows[0].now
		}), {
			status: 200,
			headers: { "Content-Type": "application/json" }
		});
	} catch (error) {
		console.error(error);
		return new Response(JSON.stringify({
			conectado: false,
			error: String(error)
		}), {
			status: 500,
			headers: { "Content-Type": "application/json" }
		});
	}
};
//#endregion
//#region \0virtual:astro:page:src/pages/api/test-db@_@ts
var page = () => test_db_exports;
//#endregion
export { page };
