// const loginSpan = document.querySelector(".login-bug span");
const btnAddProduct = document.querySelector("#btn-add-product");
const addProductForm = document.getElementById("form-add-product");
// const avatar = document.querySelector("#avatar");
const addProdMain = document.getElementById("add-prod-main");

// let loginStatus = () => {
//   fetch("/login/status").then(async (res) => {
//     if (res.status === 200) {
//       const response = await res.json();
//       const { name, avatar_path, is_admin } = await response;
//       avatar.src = avatar_path;
//       loginSpan.innerText = name;
//       if (!is_admin) {
//         console.log("you aint admin bitch!");
//         addProdMain.style.setProperty("--overlay-display", "grid");
//         addProductForm.style.display = "none";
//       } else {
//         console.log("you down...");
//       }
//     } else {
//       avatar.src = "./assets/avatars/generic_user_avatar.png";
//       loginSpan.innerText = "No one";
//     }
//   });
// };

loginStatus([], []);

function handleAddProduct(e) {
  e.preventDefault();
  const formData = new FormData(addProductForm);
  const formVals = Object.fromEntries(formData.entries());
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formVals),
  };
  fetch("/product", options).then((res) => {
    console.log("add product post request sent");
    addProductForm.reset();
  });
}

btnAddProduct.addEventListener("click", handleAddProduct);
