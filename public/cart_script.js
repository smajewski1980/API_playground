const cartTable = document.querySelector("table");

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
    cartElem.innerHTML = "This is one empty cart, go add some shit!";
  } else {
    cartTable.innerHTML =
      "<thead><td></td><td>Product Name</td><td>Quantity</td><td>Product Subtotal</td><td></td></thead>";

    data.forEach(async (item) => {
      const img = await getImgSrc(item.product_id);
      cartTable.innerHTML += `
        <tr>
        <td><img src=${img} alt=""></td>
        <td>${item.name}</td>
        <td>${item.quantity}</td>
        <td>${parseInt(item.price) * parseInt(item.quantity)}</td>
        <td><button data-prod-id=${item.product_id}>Adj Qty</button></td>
        </tr>
      `;
    });
  }
}

getCartItems();
