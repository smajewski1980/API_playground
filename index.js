const express = require("express");
const app = express();
const pg = require("pg");
const { Pool } = pg;
const pool = new Pool({
  user: "postgres",
  password: "postgres",
  host: "localhost",
  port: 5432,
  database: "user_info",
});

pool
  .connect()
  .then(console.log("connected to the database: user_info"))
  .catch((err) => {
    console.error(err.message);
  });

app.use(express.static("public"));
app.use(express.json());

app.post("/user", (req, res) => {
  const body = req.body;
  for (const val in body) {
    if (!body[val]) {
      res.status(400).send();
      return;
    }
  }
  console.log(body);
  res.status(201).send();
});

const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
  console.log(`listening on port: ${PORT}`);
});
