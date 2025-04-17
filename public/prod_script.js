const productsWrapper = document.querySelector(".products-wrapper");
let productItems = [];
const cartCountElem = document.querySelector(".cart-bug span");
const prodAddedModal = document.querySelector("dialog");
const btnModalContinue = document.getElementById("btn-modal-continue");
const modalName = document.getElementById("modal-added-name");
const modalQty = document.getElementById("modal-added-qty");
const modalImg = document.getElementById("modal-img");
const btnNavCart = document.querySelector("#products-page-nav a:last-child");
const btnNavAddProd = document.querySelector(
  "#products-page-nav a:nth-child(2)"
);
const avatar = document.querySelector("#avatar");
isUserAdmin = false;

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
      const response = await res.json();
      const { name, avatar_path, is_admin } = await response;
      loginSpan.innerText = name;
      avatar.src = avatar_path;
      isUserAdmin = is_admin;
    } else {
      avatar.src = "./assets/avatars/generic_user_avatar.png";
      productsWrapper.style.setProperty("--overlay-display", "grid");
      btnNavCart.style.pointerEvents = "none";
      btnNavCart.style.opacity = ".5";
      btnNavAddProd.style.pointerEvents = "none";
      btnNavAddProd.style.opacity = ".5";
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
        }-qty" min="1"></p>
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
      .then((res) => {
        if (!res.ok) {
          // put our not logged in code here
          return { msg: "there was a problem" };
        } else {
          return res.json();
        }
      })
      .then((res) => {
        // console.log(res);
        const name = res.name;
        const qty = res.quantity;
        modalName.innerText = name;
        modalQty.innerText = qty;
        modalImg.src = imgSrc;
        if (res.quantity >= 1) {
          console.log("item added to cart");
          prodAddedModal.showModal();
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

btnModalContinue.addEventListener("click", handleModalContinue);
