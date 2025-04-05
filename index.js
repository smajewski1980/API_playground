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

app.post("/user/:name", (req, res) => {
  const name = req.params.name;
  const pw = req.body.pw;
  console.log(name + " " + pw);
  res.send(`name: ${name}, password: ${pw}`);
});

app.post("/user", (req, res) => {
  const body = req.body;
  for (const val in body) {
    if (!body[val]) {
      res.status(400).send();
      return;
    }
  }
  pool.query(
    "insert into users(name, password, email, address_line_1, address_line_2, phone, prefers_email_notifications, prefers_phone_notifications)values ($1, $2, $3, $4, $5, $6, $7, $8) returning *",
    [
      body.name,
      body.password,
      body.email,
      body.address_line_1,
      body.address_line_2,
      body.phone,
      body.prefers_email_notifications,
      body.prefers_phone_notifications,
    ],
    (err, result) => {
      if (err) {
        console.error(err);
      } else {
        res.status(201).send(result.rows);
      }
    }
  );
  // console.log(body);
  // res.status(201).send();
});

const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
  console.log(`listening on port: ${PORT}`);
});
