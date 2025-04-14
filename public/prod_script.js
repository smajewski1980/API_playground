const productsWrapper = document.querySelector(".products-wrapper");
let productItems = [];
const cartCountElem = document.querySelector(".cart-bug span");
const prodAddedModal = document.querySelector("dialog");
const btnModalContinue = document.getElementById("btn-modal-continue");

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
        <p>&nbsp;&nbsp;quantity:&nbsp;&nbsp;<input type="number" name="quantity" class="prod-qty" id="prod-${
          item.product_id
        }-qty" min=1></p>
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
    const imgSrc = e.target.parentElement.children[0].src;
    const quantity = document.getElementById(`prod-${clickedProdId}-qty`).value;
    const options = {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        product_id: clickedProdId,
        name: clickedName,
        price: clickedPrice,
        quantity: quantity,
      }),
    };
    fetch("/cart", options)
      .then((res) => res.json())
      .then((res) => {
        const name = res.name;
        const qty = res.quantity;
        document.getElementById("modal-added-name").innerText = name;
        document.getElementById("modal-added-qty").innerText = qty;
        document.getElementById("modal-img").src = imgSrc;
        console.log("item added to cart");
        if (res.quantity >= 1) {
          prodAddedModal.showModal();
          btnModalContinue.addEventListener("click", handleModalContinue);
        }
      })
      .catch((err) => {
        console.log(err);
      });
    setCartItemCount();
  }
});

function handleModalContinue() {
  prodAddedModal.close();
  const qtyInputs = document.querySelectorAll(".prod-qty");
  qtyInputs.forEach((input) => {
    input.value = "";
  });
}
