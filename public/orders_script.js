const avatar = document.querySelector("#avatar");
const loginSpan = document.querySelector(".login-bug span");
const cartCountElem = document.querySelector(".cart-bug span");
const btnLogout = document.getElementById("btn-logout");
const orderNumsElem = document.querySelector(".order-numbers-wrapper");
const orderDetailsElem = document.querySelector(".order-details");
const ordersWrapper = document.querySelector(".orders-wrapper");

async function setCartItemCount(bool) {
  const response = await fetch("/cart/item-count");
  const count = await response.json();
  const cartItemCount = await count.itemCount;
  cartCountElem.innerText = cartItemCount;
  if (bool) {
    window.location.reload();
  }
}

setCartItemCount(false);
let currentUserName = "";

async function getCurrentUserData(user) {
  const response = await fetch(`/user/${user}`);
  const data = await response.json();
  const id = await data[0].id;
  const orders = await fetch(`/order/${id}`);
  const orderIds = await orders.json();
  orderNumsElem.innerHTML += "<p>Click an order number:</p>";
  orderIds.forEach((id) => {
    orderNumsElem.innerHTML += `
      <p class="order" data-order-id=${id.order_id}>${id.order_id}</p>
    `;
  });

  // console.log(orderIds);
}

let currentUserObj = null;

let loginStatus = () => {
  fetch("/login/status").then(async (res) => {
    if (res.status === 200) {
      const response = await res.json();
      const { name, avatar_path } = await response;
      // console.log(msg);
      loginSpan.innerHTML = `${name}</br>is logged in.`;
      avatar.src = avatar_path;
      currentUserName = name;
      currentUserObj = await response;
      getCurrentUserData(name);
    } else {
      loginSpan.innerText = "Logged Out";
      avatar.src = "./assets/avatars/generic_user_avatar.png";
      btnLogout.style.pointerEvents = "none";
      btnLogout.style.opacity = ".5";
    }
  });
};

loginStatus();

function handleLogout() {
  const logout = fetch("/logout", { method: "POST" });
  avatar.src = "";
  loginStatus();
  setCartItemCount();
  ordersWrapper.innerHTML = "<h2>Logged Out</h2>";
}

document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("order")) {
    orderDetailsElem.innerHTML = "";
    const orderNum = e.target.dataset.orderId;
    const response = await fetch(`/order/user/${orderNum}`);
    const data = await response.json();
    // console.log(data);
    let counter = 1;
    let cartSubtotal = 0;

    let HTML = `<h3>order date: ${data[0].order_date}</br>order number: ${orderNum}</h3><table>
        <thead>
          <tr><th>Quantity</th><th>Item</th><th>Unit Price</th><th>Item total</th></tr>
        </thead><tbody>`;
    data.forEach((obj) => {
      cartSubtotal += obj.subtotal;
      HTML += `  
      <tr><td>${obj.quantity}</td><td>${obj.name}</td><td>$${parseInt(
        obj.price
      ).toLocaleString()}</td><td>$${parseInt(
        obj.subtotal
      ).toLocaleString()}</td></tr>
      `;
      if (counter == data.length) {
        const shipping = cartSubtotal * 0.2;
        const tax = Math.round((cartSubtotal + shipping) * 0.1);
        const cartTotal = cartSubtotal + shipping + tax;
        HTML += `<tfoot>
            <tr>
              <td>Ship To:</td><td></td><th>cart subtotal</th><td>$${cartSubtotal.toLocaleString()}</td>
            </tr>
            <tr>
              <td><div class="shipping-info-wrapper">
               <p>${currentUserObj.name}</p>
               <p>${currentUserObj.email}</p>
               <p>${currentUserObj.phone}</p>
               <p>${currentUserObj.address_line_1}</p>
               <p>${currentUserObj.address_line_2}</p>
              </div></td><td></td><th>shipping</th><td>$${shipping.toLocaleString()}</td>
            </tr>
            <tr>
              <td></td><td></td><th>sales tax</th><td>$${tax.toLocaleString()}</td>
            </tr>
            <tr>
              <td></td><td></td><th>TOTAL</th><td>$${cartTotal.toLocaleString()}</td>
            </tr>
          </tfoot>`;
        orderDetailsElem.innerHTML = HTML + "</tbody></table>";
      }
      counter++;
    });
  }
});

btnLogout.addEventListener("click", handleLogout);
