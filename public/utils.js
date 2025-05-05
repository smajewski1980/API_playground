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

const loginStatus = (goodStatus, badStatus) => {
  let isUserAdmin = null;
  fetch("/login/status").then(async (res) => {
    if (res.status === 200) {
      const response = await res.json();
      const { name, avatar_path, is_admin } = await response;
      loginSpan.innerHTML = `${name}</br>is logged in`;
      avatar.src = avatar_path;
      isUserAdmin = is_admin;
      if (typeof currentUserName === "object") {
        currentUserName = name;
      }
      // here extra logged in code
      goodStatus.forEach((item) => {
        item.style.pointerEvents = "initial";
        item.style.opacity = "1";
      });
      if (typeof loginForm === "object") {
        loginForm.style.display = "none";
      }
      if (typeof btnCreateUser === "object" && isUserAdmin !== null) {
        btnCreateUser.style.pointerEvents = "none";
        btnCreateUser.style.opacity = ".5";
      }
      if (typeof addProdMain === "object") {
        if (!is_admin) {
          addProdMain.style.setProperty("--overlay-display", "grid");
          addProductForm.style.display = "none";
          // also make dashboard link inactive
          dashboardLink.style.display = "none";
        }
      }
    } else {
      loginSpan.innerHTML = "Logged out";
      avatar.src = "./assets/avatars/generic_user_avatar.png";
      // if no one is logged in, show the go log in overlay on products page
      if (isUserAdmin === null && typeof productsWrapper === "object") {
        productsWrapper.style.setProperty("--overlay-display", "grid");
      }
      // here extra not logged in code
      badStatus.forEach((item) => {
        item.style.pointerEvents = "none";
        item.style.opacity = ".5";
      });
      if (typeof btnCreateUser === "object") {
        btnCreateUser.style.pointerEvents = "initial";
        btnCreateUser.style.opacity = "1";
      }
    }
  });
};
