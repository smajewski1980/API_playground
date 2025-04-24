const dateWrapper = document.querySelector(".date-wrapper");
const totalSalesSpan = document.querySelector(".total-sales-wrapper span");
const lastWeekSalesSpan = document.querySelector(
  ".last-week-sales-wrapper span"
);
const totalOrdersSpan = document.querySelector(".total-orders-wrapper span");
const avgOrderSpan = document.querySelector(".avg-order-price-wrapper span");
const ordersSpan = document.querySelector(".orders-wrapper span");

const date = new Date();
let hours = date.getHours();
const ampm = hours >= 12 ? "PM" : "AM";
hours = hours % 12;
hours = hours ? hours : 12; // the hour '0' should be '12'

setInterval(() => {
  const date = new Date();
  const time =
    hours +
    ":" +
    (date.getMinutes() < 10 ? "0" : "") +
    date.getMinutes() +
    ":" +
    (date.getSeconds() < 10 ? "0" : "") +
    date.getSeconds() +
    " " +
    ampm;
  dateWrapper.innerHTML = `<div class='date'>${date.toDateString()}</div><div class='time'>${time}</div>`;
}, 1000);

async function setTotalSalesUI(data) {
  totalSalesSpan.innerText = `$${parseInt(data).toLocaleString()}`;
}

async function setTotalOrderQtyUI(data) {
  totalOrdersSpan.innerText = data;
}

async function setSalesLastSevenDays(data) {
  let outputData = "";
  data.forEach((obj) => {
    outputData += `<p>${obj.order_date}: $${parseInt(
      obj.daily_total
    ).toLocaleString()}</p>`;
  });
  lastWeekSalesSpan.innerHTML += outputData;
}

async function setAvgOrder(data) {
  avgOrderSpan.innerText = data;
}

async function setAllOrders(data) {
  let html = `
      <table>
        <thead>
          <tr><th>order id</th><th>user id</th><th>user name</th><th>user email</th><th>order date</th><th>total item qty</th><th>subtotal</th><th>shipping</th><th>tax</th><th>order total</th></tr>
        </thead>
        <tbody>
    `;
  data.forEach((obj) => {
    html += `
      <tr><td>${obj.order_id}</td><td>${obj.user_id}</td><td>${obj.name}</td><td>${obj.email}</td><td>${obj.order_date}</td><td>${obj.total_item_qty}</td><td>${obj.subtotal}</td><td>${obj.shipping}</td><td>${obj.tax}</td><td>${obj.order_total}</td></tr>
    `;
  });

  html += "</tbody></table>";
  ordersSpan.innerHTML = html;
}

async function loadData() {
  const response = await fetch("/dashboard");
  const data = await response.json();
  setTotalSalesUI(data.totalSales);
  setTotalOrderQtyUI(data.totalNumOrders);
  setSalesLastSevenDays(data.lastSevenDays);
  setAvgOrder(data.avgOrder);
  setAllOrders(data.allOrdersInfo);
  // console.log(data.lastSevenDays);
}

loadData();
