const express = require("express");
const router = express.Router();
const pool = require("../db_connect");

router.get("/", (req, res, next) => {
  const dashInfo = {};
  // dashInfo.msg = "test";
  Promise.all([
    pool.query("select round as avg_total from avg_order_total"),
    (err, result) => {
      if (err) next(err);
      return result.rows;
    },
    pool.query("select total_sales from total_sales"),
    (err, result) => {
      if (err) next(err);
      return result.rows;
    },
    pool.query("select * from last7_daily_totals"),
    (err, result) => {
      if (err) next(err);
      return result.rows;
    },
    pool.query("select * from num_orders"),
    (err, result) => {
      if (err) next(err);
      return result.rows;
    },
    pool.query("select * from orders_dashboard"),
    (err, result) => {
      if (err) next(err);
      return result.rows;
    },
  ]).then((resp) => {
    dashInfo.avgOrder = resp[0].rows[0].avg_total;
    dashInfo.totalSales = resp[2].rows[0].total_sales;
    dashInfo.lastSevenDays = resp[4].rows;
    dashInfo.totalNumOrders = resp[6].rows[0].count;
    dashInfo.allOrdersInfo = resp[8].rows;
    return res.status(200).send(dashInfo);
  });
});

module.exports = router;
