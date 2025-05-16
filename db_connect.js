require("dotenv").config();
const pg = require("pg");
const { Pool } = pg;
const pool = new Pool({
  user: "postgres",
  password: process.env.PASSWORD,
  host: "localhost",
  port: 5432,
  database: "API_playground",
});

module.exports = pool;
