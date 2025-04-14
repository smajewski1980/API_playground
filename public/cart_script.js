const cartTable = document.querySelector("table");
const cartMsg = document.querySelector(".cart-msg");
const loginSpan = document.querySelector(".login-bug span");

const cartCountElem = document.querySelector(".cart-bug span");

async function setCartItemCount() {
  const response = await fetch("/cart/item-count");
  const count = await response.json();
  const cartItemCount = await count.itemCount;
  cartCountElem.innerText = cartItemCount;
}

setCartItemCount();

let loginStatus = () => {
  fetch("/login/status").then(async (res) => {
    if (res.status === 200) {
      const { msg } = await res.json();
      console.log(msg);
      loginSpan.innerText = msg;
    }
  });
};

loginStatus();

async function getCartItems() {
  const response = await fetch("/cart")
    .then((res) => res.json())
    .then((res) => displayItems(res))
    .catch((err) => {
      console.log(err);
    });
}

async function getImgSrc(id) {
  const response = await fetch(`/product/${id}`)
    .then((res) => res.json())
    .then((res) => res[0].img_url);
  return await response;
}

function displayItems(data) {
  const isEmpty = (obj) => Object.keys(obj).length === 0;
  console.log(isEmpty(data));
  if (isEmpty(data)) {
    cartMsg.innerHTML = "This is one empty cart, go add some shit!";
  } else {
    const cartLength = data.length;
    let counter = 1;

    cartTable.innerHTML =
      "<caption>Your Cart</caption><thead><th></th><th>Product Name</th><th>Price</th><th>Quantity</th><th></th><th>Product Subtotal</th>";

    let html = "";

    function getSub(price, qty) {
      return price * qty;
    }

    let cartSubTotal = 0;

    data.forEach(async (item) => {
      const img = await getImgSrc(item.product_id);
      const itemSub = getSub(item.price, item.quantity);
      cartSubTotal += parseInt(itemSub);
      html += `
        <tr>
        <td><img src=${img} alt=""></td>
        <td>${item.name}</td>
        <td>$${getSub(item.price, 1).toLocaleString()}</td>
        <td>${item.quantity}</td>
        <td>
          <button class="cart-item-adj" data-prod-id=${
            item.product_id
          }>Adj Qty</button>
          <button class="cart-item-del" data-prod-id=${
            item.product_id
          }>Remove</button>
        </td>
        <td>$${itemSub.toLocaleString()}</td>
        </tr>
      `;
      if (counter === cartLength) {
        const shipping = cartSubTotal * 0.2;
        const total = shipping + cartSubTotal;
        html += `
          <tfoot>
            <tr>
              <td></td><td></td><td></td><td></td><th>cart subtotal</th><td>$${cartSubTotal.toLocaleString()}</td>
            </tr>
            <tr>
              <td></td><td></td><td></td><td></td><th>shipping</th><td>$${shipping.toLocaleString()}</td>
            </tr>
            <tr>
              <td></td><td></td><td></td><td></td><th>TOTAL</th><td>$${total.toLocaleString()}</td>
            </tr>
          </tfoot>`;
        cartTable.innerHTML += html;
      }

      counter++;
    });
  }
}

getCartItems();
