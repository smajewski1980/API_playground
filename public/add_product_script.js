const loginSpan = document.querySelector(".login-bug span");
const btnAddProduct = document.querySelector("#btn-add-product");
const addProductForm = document.getElementById("form-add-product");

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
