const express = require("express");
const router = express.Router();

// get all cart items
router.get("/", (req, res, next) => {
  if (!req.session.user) {
    const err = new Error("go log in first");
    next(err);
  } else if (!req.session.cart) {
    const err = new Error("cart is empty");
    next(err);
  } else {
    res.send(req.session.cart);
  }
});

router.get("/item-count", (req, res, next) => {
  let itemCount = 0;
  if (req.session.cart) {
    req.session.cart.forEach((item) => {
      itemCount += parseInt(item.quantity);
    });
  }

  const qty = req.session.cart ? itemCount : 0;

  res.status(200).send({ itemCount: itemCount });
});

// get cart item by id, return the cartItem obj
router.get("/:id", (req, res, next) => {
  const id = req.params.id;
  const itemIndex = req.session.cart.findIndex(
    (item) => item.product_id === id
  );
  if (itemIndex === -1) {
    const err = new Error("that product id is not in the cart");
    next(err);
  } else {
    const item = req.session.cart[itemIndex];
    res.json(item);
  }
});

// post an item to cart
router.post("/", (req, res, next) => {
  const { product_id, name, price, quantity } = req.body;
  const newItem = {
    product_id: product_id,
    name: name,
    price: price,
    quantity: parseInt(quantity),
  };
  if (!product_id || !name || !price || !quantity) {
    const err = new Error("empty field in request body");
    next(err);
    return;
  }

  if (!req.session.cart && req.session.user) {
    req.session.cart = [newItem];
    res.status(200).send(newItem);
  } else if (req.session.user) {
    const cartHasItem = req.session.cart.find(
      (item) => item.product_id === newItem.product_id
    );

    if (!cartHasItem) {
      req.session.cart.push(newItem);
      res.status(200).send(newItem);
    } else {
      const newItemQty = newItem.quantity;
      const index = req.session.cart.findIndex(
        (obj) => obj.product_id === newItem.product_id
      );
      req.session.cart[index].quantity += parseInt(newItemQty);
      res.status(200).send(newItem);
    }
  }
});

// update cart qty during checkout
router.put("/", (req, res, next) => {
  const { product_id, name, price, quantity } = req.body;
  const updatedItem = {
    product_id: product_id,
    name: name,
    price: price,
    quantity: parseInt(quantity),
  };

  const index = req.session.cart.findIndex(
    (obj) => obj.product_id === updatedItem.product_id
  );

  req.session.cart[index] = updatedItem;
  res.status(200).send(req.session.cart);
});

router.delete("/:id", (req, res, next) => {
  const id = req.params.id;
  const index = req.session.cart.findIndex((item) => item.product_id === id);
  if (index !== -1) {
    req.session.cart.splice(index, 1);
  }
  res.send(req.session.cart);
});
// cart/checkout - to return checkout object data

module.exports = router;
