const productsWrapper = document.querySelector(".products-wrapper");
let productItems = [];
const cartCountElem = document.querySelector(".cart-bug span");

async function setCartItemCount() {
  const response = await fetch("/cart/item-count");
  const count = await response.json();
  const cartItemCount = await count.itemCount;
  cartCountElem.innerText = cartItemCount;
}

setCartItemCount();

const loginSpan = document.querySelector(".login-bug span");

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

const products = async () => {
  await fetch("/product")
    .then(async (res) => {
      response = await res.json();
      response.forEach((prod) => {
        productItems.push(prod);
      });
    })
    .then(() => {
      showProducts();
    });
};
products();

function showProducts() {
  productItems.forEach((item) => {
    productsWrapper.innerHTML += `
    <div data-prod-id=${item.product_id} data-name=${item.name.replace(
      " ",
      "-"
    )} data-price=${item.price} class="product-card">
      <img src=${item.img_url} alt=${item.name} />
      <div class="card-text-wrapper">
        <p>&nbsp;&nbsp;name: ${item.name}</p>
        <p>&nbsp;&nbsp;price: $${item.price}</p>
        <p>&nbsp;&nbsp;quantity: ${item.quantity}</p>
      </div>
      <button class='btn-add-to-cart'>add to cart</button>
    </div>
    `;
  });
}

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-add-to-cart")) {
    // console.log(e.target.parentElement.dataset.prodId);
    // console.log("you clicked one of the add btns");
    const clickedProdId = e.target.parentElement.dataset.prodId;
    const clickedName = e.target.parentElement.dataset.name;
    const clickedPrice = e.target.parentElement.dataset.price;
    const options = {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        product_id: clickedProdId,
        name: clickedName,
        price: clickedPrice,
        quantity: "1",
      }),
    };
    fetch("/cart", options)
      .then((res) => console.log("item added to cart"))
      .catch((err) => {
        console.log(err);
      });
    setCartItemCount();
  }
});
