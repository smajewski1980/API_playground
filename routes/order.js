const express = require("express");
const router = express.Router();
router.get("/", (req, res, next) => {
  console.log(req.session.cart);
  console.log(req.session.userObj);
  // insert user into order table and get back order number
  // use order number to insert product ids and qtys to prder_items table
  res.status(200).send({ msg: "order received, confirmation no will go here" });
});

module.exports = router;
