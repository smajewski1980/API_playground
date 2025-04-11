const cartElem = document.querySelector(".cart-wrapper");

async function getCartItems() {
  const response = await fetch("/cart")
    .then((res) => res.json())
    .then((res) => displayItems(res))
    .catch((err) => {
      console.log(err);
    });
}

function displayItems(data) {
  console.log(data);
  data.forEach((item) => {
    cartElem.innerHTML += `
      <div class='cart-item'>
        <p>${item.product_id}</p>
        <p>${item.name}</p>
        <p>${item.price}</p>
        <p>${item.quantity}</p>
      </div>
      <hr>
    `;
  });
}

getCartItems();
