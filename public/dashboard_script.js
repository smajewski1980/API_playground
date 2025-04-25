const dateWrapper = document.querySelector(".date-wrapper");
const totalSalesSpan = document.querySelector(".total-sales-wrapper span");
// const lastWeekSalesSpan = document.querySelector(
//   ".last-week-sales-wrapper span"
// );
const totalOrdersSpan = document.querySelector(".total-orders-wrapper span");
const avgOrderSpan = document.querySelector(".avg-order-price-wrapper span");
const ordersSpan = document.querySelector(".orders-wrapper");
const barOne = document.querySelector(".bar-chart-1");
const barTwo = document.querySelector(".bar-chart-2");
const barThree = document.querySelector(".bar-chart-3");
const barFour = document.querySelector(".bar-chart-4");
const barFive = document.querySelector(".bar-chart-5");
const barSix = document.querySelector(".bar-chart-6");
const barSeven = document.querySelector(".bar-chart-7");
const barsArray = [
  barSeven,
  barSix,
  barFive,
  barFour,
  barThree,
  barTwo,
  barOne,
];

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
  dateWrapper.innerHTML = `<div class='date'><h1>Dashboard</h1>${date.toDateString()}</div><div class='time'>${time}</div>`;
}, 1000);

function addMoneyCommas(str) {
  return parseInt(str).toLocaleString();
}

async function setTotalSalesUI(data) {
  totalSalesSpan.innerText = `$${addMoneyCommas(data)}`;
}

async function setTotalOrderQtyUI(data) {
  totalOrdersSpan.innerText = addMoneyCommas(data);
}

async function setSalesLastSevenDays(data) {
  const largestTotal = parseInt(data[0].daily_total);
  const availHeight = 130;
  const scaleFactor = availHeight / largestTotal;
  const sortedDataNewestFirst = data.sort((a, b) => {
    return a.order_date < b.order_date
      ? 1
      : b.order_date < a.order_date
      ? -1
      : 0;
  });
  const heightValsNewestFirst = [];
  sortedDataNewestFirst.forEach((item) => {
    const total = item.daily_total;
    const scaled = total * scaleFactor;
    heightValsNewestFirst.push(Math.round(scaled));
  });

  for (let i = 0; i < barsArray.length; i++) {
    const heightVal = `${heightValsNewestFirst[i]}px`;
    barsArray[i].style.height = heightVal;
  }

  console.log(sortedDataNewestFirst);
  console.log(heightValsNewestFirst);
}

async function setAvgOrder(data) {
  avgOrderSpan.innerText = `$${addMoneyCommas(data)}`;
}

async function setAllOrders(data) {
  let html = `
      <table>

        <tbody>
    `;
  data.forEach((obj) => {
    html += `
      <tr><td>${obj.order_id}</td><td>${obj.user_id}</td><td>${
      obj.name
    }</td><td>${obj.email}</td><td>${obj.order_date}</td><td>${
      obj.total_item_qty
    }</td><td>$${addMoneyCommas(obj.subtotal)}</td><td>$${addMoneyCommas(
      obj.shipping
    )}</td><td>$${addMoneyCommas(obj.tax)}</td><td>$${addMoneyCommas(
      obj.order_total
    )}</td></tr>
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
