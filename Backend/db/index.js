import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new pg.Pool({
  user: process.env.USERDB,
  host: process.env.HOSTDB,
  database: process.env.DATABASE,
  password: process.env.PASSWORDDB,
  port: process.env.PORTDB,
});

export default pool;

// merging test
