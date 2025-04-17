const express = require("express");
const router = express.Router();
router.get("/", (req, res, next) => {
  // const { user_id, prod_id, quantity } = req.body;
  // console.log(user_id, prod_id, quantity);
  console.log(req.session.cart);
  console.log(req.session.userObj);
  res.status(200).send({ msg: "order received, confirmation no will go here" });
});

module.exports = router;
