import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";


const adapter = new JSONFile("database.json");
const db = new Low(adapter, { mesas: [], contador_mesas: 1, menus: [], contador_menus: 1 });
await db.read();

export default db;