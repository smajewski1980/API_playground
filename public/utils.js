const loginSpan = document.querySelector(".login-bug span");
const btnLogout = document.getElementById("btn-logout");
const avatar = document.querySelector("#avatar");
const cartCountElem = document.querySelector(".cart-bug span");
const loginBug = document.querySelector(".login-bug");

async function setCartItemCount() {
  const response = await fetch("/cart/item-count");
  const count = await response.json();
  const cartItemCount = await count.itemCount;
  cartCountElem.innerText = cartItemCount;
}
