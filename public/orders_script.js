const avatar = document.querySelector("#avatar");
const loginSpan = document.querySelector(".login-bug span");
const cartCountElem = document.querySelector(".cart-bug span");
const btnLogout = document.getElementById("btn-logout");
const orderNumsElem = document.querySelector(".order-numbers-wrapper");
const orderDetailsElem = document.querySelector(".order-details");

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
  orderIds.forEach((id) => {
    orderNumsElem.innerHTML += `
      <p class="order" data-order-id=${id.order_id}>${id.order_id}</p>
    `;
  });

  console.log(orderIds);
  // currentUserId = await id;
  // console.log(await data[0].id);
  // return currentUserObj;
}

let loginStatus = () => {
  fetch("/login/status").then(async (res) => {
    if (res.status === 200) {
      const response = await res.json();
      const { name, avatar_path } = await response;
      // console.log(msg);
      loginSpan.innerText = name;
      avatar.src = avatar_path;
      currentUserName = name;
      getCurrentUserData(name);
    } else {
      loginSpan.innerText = "No one";
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
}

document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("order")) {
    const orderNum = e.target.dataset.orderId;
    orderDetailsElem.innerHtml = "";
    const response = await fetch(`/order/user/${orderNum}`);
    const data = await response.json();
    console.log(data);
    orderDetailsElem.innerHTML = `
      <p>Order Number: ${data[0].order_id}</p>
      <p>User Id: ${data[0].user_id}</p>
      <p>Order Completed: ${data[0].completed}</p>
    `;
  }
});

btnLogout.addEventListener("click", handleLogout);
