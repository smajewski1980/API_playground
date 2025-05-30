const cartTable = document.querySelector("table");
const cartMsg = document.querySelector(".cart-msg");
const adjQtyModal = document.querySelector("dialog");
const modalImg = document.getElementById("modal-img");
const modalName = document.getElementById("modal-update-name");
const modalQty = document.getElementById("modal-update-qty");
const btnModalCancel = document.getElementById("btn-modal-cancel");
const btnModalUpdate = document.getElementById("btn-modal-update");
const btnPay = document.querySelector("#btn-pay");

setCartItemCount();
let currentUserName = "";

async function setCurrentUserName() {
  const response = await fetch("/login/status");
  const data = await response.json();
  currentUserName = data.name;
}
setCurrentUserName();

async function getCurrentUserData(user) {
  const response = await fetch(`/user/${user}`);
  const data = await response.json();
  const currentUserObj = await data;
  return currentUserObj;
}

loginStatus([], []);

async function getCartItems() {
  const response = await fetch("/cart")
    .then((res) => {
      if (!res.ok) {
        cartMsg.innerHTML = "This is one empty cart, go add some shit!";
        cartTable.innerHTML = "";
        btnPay.style.display = "none";
      } else {
        return res.json();
      }
    })
    .then((res) => {
      displayItems(res);
    })
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

  if (isEmpty(data)) {
    cartMsg.innerHTML = "This is one empty cart, go add some shit!";
    cartTable.innerHTML = "";
    btnPay.style.display = "none";
  } else {
    const cartLength = data.length;
    let counter = 1;
    let html = "";

    function getSub(price, qty) {
      return price * qty;
    }

    function calcSalesTax(subtotal, shipping) {
      return Math.round((subtotal + shipping) * 0.1);
    }

    let cartSubTotal = 0;

    data.forEach(async (item) => {
      const img = await getImgSrc(item.product_id);
      const itemSub = getSub(item.price, item.quantity);
      cartSubTotal += parseInt(itemSub);
      const currentUserObj = await getCurrentUserData(currentUserName);
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
        const total =
          shipping + cartSubTotal + calcSalesTax(cartSubTotal, shipping);
        html += `
          <tfoot>
            <tr>
              <td></td><td>Ship To:</td><td></td><td></td><th>cart subtotal</th><td>$${cartSubTotal.toLocaleString()}</td>
            </tr>
            <tr>
              <td></td><td><div class="shipping-info-wrapper">
               <p>${currentUserObj[0].name}</p>
               <p>${currentUserObj[0].email}</p>
               <p>${currentUserObj[0].phone}</p>
               <p>${currentUserObj[0].address_line_1}</p>
               <p>${currentUserObj[0].address_line_2}</p>
              </div></td><td></td><td></td><th>shipping</th><td>$${shipping.toLocaleString()}</td>
            </tr>
            <tr>
              <td></td><td></td><td></td><td></td><th>sales tax</th><td>$${calcSalesTax(
                cartSubTotal,
                shipping
              ).toLocaleString()}</td>
            </tr>
            <tr>
              <td></td><td></td><td></td><td></td><th>TOTAL</th><td>$${total.toLocaleString()}</td>
            </tr>
          </tfoot>`;
        cartTable.innerHTML = `<caption>${currentUserName}'s Cart</caption><thead><th></th><th>Product Name</th><th>Price</th><th>Quantity</th><th></th><th>Product Subtotal</th>`;
        cartTable.innerHTML += html;
      }

      counter++;
      const delBtns = document.querySelectorAll(".cart-item-del");
      const adjQtyBtns = document.querySelectorAll(".cart-item-adj");
      delBtns.forEach((btn) => {
        btn.addEventListener("click", handleBtnDelete);
      });
      adjQtyBtns.forEach((btn) => {
        btn.addEventListener("click", handleBtnAdj);
      });
    });
  }
}

function handleBtnDelete(e) {
  e.preventDefault();
  let prod_id = e.target.dataset.prodId;

  fetch(`cart/${prod_id}`, { method: "DELETE" })
    .then((res) => res.json())
    .then((res) => displayItems(res))
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      window.location.reload();
    });
}

let currentItem = null;

async function handleBtnAdj(e) {
  e.preventDefault();
  let prodId = e.target.dataset.prodId;
  const imgSrc = await getImgSrc(prodId);

  await fetch(`/cart/${prodId}`)
    .then((res) => res.json())
    .then((res) => {
      currentItem = {
        product_id: prodId,
        name: res.name,
        price: res.price,
        quantity: res.quantity,
      };
      modalImg.src = imgSrc;
      modalName.innerText = res.name;
      modalQty.value = res.quantity;
      adjQtyModal.showModal();
    });
}

getCartItems();

async function handleAdjQty(e) {
  e.preventDefault();
  if (modalQty.value < 1) {
    modalQty.value = 1;
  }
  const options = {
    method: "PUT",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      product_id: currentItem.product_id,
      name: currentItem.name,
      price: currentItem.price,
      quantity: modalQty.value,
    }),
  };
  await fetch("/cart", options)
    .then((res) => res.json())
    .then((res) => {
      displayItems(getCartItems());
    });

  window.location.reload();
  adjQtyModal.close();
  currentItem = null;
}

async function handlePay(e) {
  e.preventDefault();
  cartTable.style.display = "none";
  btnPay.style.display = "none";
  cartCountElem.innerText = "0";
  const response = await fetch("/order");
  const data = await response.json();
  console.log(await data.msg);
  cartMsg.innerHTML = await data.msg;
}

btnModalUpdate.addEventListener("click", handleAdjQty);
btnModalCancel.addEventListener("click", () => {
  adjQtyModal.close();
});
btnPay.addEventListener("click", handlePay);
