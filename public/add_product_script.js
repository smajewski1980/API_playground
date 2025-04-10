const loginSpan = document.querySelector(".login-bug span");
const btnAddProduct = document.querySelector("#btn-add-product");

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

function handleAddProduct(e) {
  e.preventDefault();
}

btnAddProduct.addEventListener("click", handleAddProduct);
