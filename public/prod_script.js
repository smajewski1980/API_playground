const productsWrapper = document.querySelector(".products-wrapper");
let productItems = [];

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
    console.log(item);
    productsWrapper.innerHTML += `
    <div class="product-card">
      <p>Product_id: ${item.product_id}</p>
      <p>&nbsp;&nbsp;name: ${item.name}</p>
      <p>&nbsp;&nbsp;price: ${item.price}</p>
      <p>&nbsp;&nbsp;quantity: ${item.quantity}</p>
      <img src=${item.img_url} alt=${item.name} />
    </div>
    `;
  });
}
console.log(productItems);
