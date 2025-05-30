const express = require("express");
const router = express.Router();
const pool = require("../db_connect");

// pool
//   .connect()
//   .then(console.log("connected to the database: API_playground"))
//   .catch((err) => {
//     console.error(err.message);
//   });

router.get("/", (req, res, next) => {
  pool.query("select * from products order by name", (err, result) => {
    if (err) {
      next(err);
    } else {
      // req.session.visited = true;
      res.send(result.rows);
    }
  });
});

// need to make a get "/:id" endpoint here
router.get("/:id", (req, res, next) => {
  const id = parseInt(req.params.id);
  pool.query(
    "select * from products where product_id = $1",
    [id],
    (err, result) => {
      if (err) {
        next(err);
        return;
      } else {
        res.status(200).send(result.rows);
      }
    }
  );
});

router.post("/", (req, res, next) => {
  const body = req.body;
  for (const val in body) {
    if (!body[val]) {
      res.status(400).send();
      return;
    }
  }
  pool.query(
    "insert into products(name, price, quantity, img_url) values($1, $2, $3, $4) returning *",
    [body.name, body.price, body.quantity, body.img_url],
    (err, result) => {
      if (err) {
        // this was changed since last test insert
        next(err);
      } else res.status(201).send(result.rows);
    }
  );
});

router.put("/", async (req, res) => {
  const body = req.body;
  for (const val in body) {
    if (!body[val]) {
      res
        .status(400)
        .send({ message: "make sure all items are filled in correctly" });
      return;
    }
  }
  const result = await pool.query(
    "update products set name = $1, price = $2, quantity = $3, img_url = $4 where product_id = $5 returning *",
    [body.name, body.price, body.quantity, body.img_url, body.product_id]
  );

  if (!result.rowCount) {
    return res.status(400).send({ message: "no items matched" });
  }

  res.status(201).send(result.rows);
});

router.delete("/", async (req, res) => {
  const deleteId = req.body.product_id;
  const result = await pool.query(
    "delete from products where product_id = $1",
    [deleteId]
  );
  res.status(204).send();
});

module.exports = router;
