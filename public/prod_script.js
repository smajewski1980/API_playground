let productItems = [];

const products = async () => {
  await fetch("/product").then(async (res) => {
    response = await res.json();
    response.forEach((prod) => {
      productItems.push(prod);
    });
  });
};
products();

console.log(productItems);
