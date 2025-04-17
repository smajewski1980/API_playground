const express = require("express");
const router = express.Router();
const pool = require("../db_connect");

router.get("/", (req, res, next) => {
  // insert user into order table and get back order number
  pool.query(
    "insert into orders(user_id) values($1) returning *",
    [req.session.userObj.id],
    (err, result) => {
      if (err) {
        const error = new Error(err);
        next(error);
        return;
      } else {
        const orderId = result.rows[0].order_id;
        const cart = req.session.cart;
        // use order number to insert product ids and qtys to prder_items table
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
                console.log(`inserted: ${result.rows[0].product_id}`);
              }
            }
          );
        });
        // console.log(cart);
        const resMsg = `order received, confirmation number: ${orderId}</br>You will receive an email shortly.`;
        res.status(200).send({
          msg: resMsg,
        });
      }
    }
  );
});

module.exports = router;
