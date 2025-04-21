const btnAddProduct = document.querySelector("#btn-add-product");
const addProductForm = document.getElementById("form-add-product");
const addProdMain = document.getElementById("add-prod-main");

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
