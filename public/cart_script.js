const cartElem = document.querySelector(".cart-wrapper");

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

function displayItems(data) {
  const isEmpty = (obj) => Object.keys(obj).length === 0;
  console.log(isEmpty(data));
  if (isEmpty(data)) {
    cartElem.innerHTML = "This is one empty cart, go add some shit!";
  } else {
    cartElem.innerHTML = "";
    data.forEach((item) => {
      cartElem.innerHTML += `        
        <p class='cart-item'>item id: ${
          item.product_id
        } &nbsp;&nbsp;&nbsp;name: ${item.name} &nbsp;&nbsp;&nbsp;price: $${
        item.price
      } &nbsp;&nbsp;&nbsp;qty: ${
        item.quantity
      } &nbsp;&nbsp;&nbsp; item total: $${
        parseInt(item.price) * parseInt(item.quantity)
      }</p>
        <hr>
      `;
    });
  }
}

getCartItems();
