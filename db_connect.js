const pg = require("pg");
const PASSWORD = require("./secure");
const { Pool } = pg;
const pool = new Pool({
  user: "postgres",
  password: PASSWORD,
  host: "localhost",
  port: 5432,
  database: "API_playground",
});

module.exports = pool;
