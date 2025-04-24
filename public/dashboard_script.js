const dateWrapper = document.querySelector(".date-wrapper");
const totalSalesSpan = document.querySelector(".total-sales-wrapper span");
const lastWeekSalesWrapper = document.querySelector(".last-week-sales-wrapper");
const totalOrdersWrapper = document.querySelector(".total-orders-wrapper");
const avgOrderWrapper = document.querySelector(".avg-order-price-wrapper");
const ordersWrapper = document.querySelector(".orders-wrapper");

// need to go set up the endpoints
// totalSalesSpan.innerText = fetch('');

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
  dateWrapper.innerHTML = time;
}, 1000);
