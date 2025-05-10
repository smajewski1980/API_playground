const express = require("express");
const router = express.Router();
const pool = require("../db_connect");
const hashPassword = require("../utils/hashPassword");

pool
  .connect()
  .then(console.log("connected to the database: API_playground"))
  .catch((err) => {
    console.error(err.message);
  });

router.get("/:name", (req, res, next) => {
  const name = req.params.name;

  pool.query("select * from users where name = $1", [name], (err, result) => {
    if (err) {
      next(err);
    } else {
      res.send(result.rows);
    }
  });
});

router.post("/", (req, res) => {
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
});

router.put("/", async (req, res) => {
  const body = req.body;
  console.log(body);
  for (const val in body) {
    if (!body[val]) {
      res.status(400).send();
      return;
    }
  }
  pool.query(
    "update users set name = $1, password = $2, email = $3, address_line_1 = $4, address_line_2 = $5, phone = $6, prefers_email_notifications = $7, prefers_phone_notifications = $8 where id = $9",
    [
      body.name,
      await hashPassword(body.password),
      body.email,
      body.address_line_1,
      body.address_line_2,
      body.phone,
      body.prefers_email_notifications,
      body.prefers_phone_notifications,
      body.id,
    ],
    (err, result) => {
      if (err) {
        console.error(err);
      } else {
        res.status(201).send(result.rows);
      }
    }
  );
});

module.exports = router;
