const express = require("express");
const router = express.Router();
const pool = require("../db_connect");

router.get("/", (req, res, next) => {
  pool.query("update site_hits set num_hits = num_hits + 1");
  // console.log("clink");
  res.status(200).send();
});

module.exports = router;
