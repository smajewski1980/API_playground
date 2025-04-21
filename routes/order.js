const express = require("express");
const router = express.Router();
const pool = require("../db_connect");

function getTimeStamp() {
  const now = new Date();
  const month = now.getMonth();
  const day = now.getDate();
  const year = now.getFullYear();
  const hours = now.getHours();
  const minutes1 = now.getMinutes() < 10 ? "0" : "";
  const minutes2 = now.getMinutes();

  const timeStamp = `${month}/${day}/${year} ${hours}:${minutes1}${minutes2}`;
  return timeStamp;
}

router.get("/", (req, res, next) => {
  // insert user into order table and get back order number
  pool.query(
    `insert into orders(user_id, order_date) values($1, $2) returning *`,
    [req.session.userObj.id, getTimeStamp()],
    (err, result) => {
      if (err) {
        const error = new Error(err);
        next(error);
        return;
      } else {
        const orderId = result.rows[0].order_id;
        const cart = req.session.cart;
        // use order number to insert product ids and qtys to order_items table
        cart.forEach((cartItem) => {
          const id = cartItem.product_id;
          const qty = cartItem.quantity;
          pool.query(
            "insert into order_items(order_id, product_id, quantity) values ($1, $2, $3) returning *",
            [orderId, id, qty],
            async (err, result) => {
              if (err) {
                const error = new Error(err);
                next(error);
                return;
              } else {
                // console.log(`inserted: ${result.rows[0].product_id}`);
              }
            }
          );
        });
        // need to clear session cart data
        req.session.cart = [];
        const resMsg = `order received, confirmation number: ${orderId}</br>You will receive an email shortly.`;
        res.status(200).send({
          msg: resMsg,
        });
      }
    }
  );
});

router.get("/:userID", (req, res, next) => {
  const id = req.params.userID;
  pool.query(
    "select order_id from orders where user_id = $1 order by order_id desc",
    [id],
    (err, result) => {
      if (err) {
        const error = new Error(err);
        next(err);
        return;
      }
      // console.log(result.rows);
      res.status(200).send(result.rows);
    }
  );
});

router.get("/user/:orderID", (req, res, next) => {
  console.log("getting an order for the client");
  const id = req.params.orderID;
  pool.query(
    "select order_id, order_date, name, quantity, price, subtotal from get_subtotal where order_id = $1",
    [parseInt(id)],
    (err, result) => {
      if (err) {
        next(err);
        return;
      }
      // console.log(result.rows);
      res.status(200).send(result.rows);
    }
  );
});

module.exports = router;
