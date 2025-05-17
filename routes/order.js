const express = require("express");
const router = express.Router();
const pool = require("../db_connect");

const Socket = require("../utils/Socket").socket;

function getTimeStamp() {
  const now = new Date();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const year = now.getFullYear();

  const timeStamp = `${month}/${day}/${year}`;
  return timeStamp;
}

// this get route triggers the session cart to be an order
// creates an order to get order number
// then inserts the items
router.get("/", (req, res, next) => {
  const socket = Socket.getIo();
  // insert user into order table and get back order number
  pool.query(
    `insert into orders(user_id, order_date) values($1, $2) returning *`,
    [req.user.id, getTimeStamp()],
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
        socket.emit("new-order", { msg: "there is a new order" });
        res.status(200).send({
          msg: resMsg,
          orderNum: orderId,
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
