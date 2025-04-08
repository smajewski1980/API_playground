const express = require("express");
const app = express();
const user = require("./routes/user");
const product = require("./routes/product");

app.use(express.static("public"));
app.use(express.json());
app.use("/user", user);
app.use("/product", product);

const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
  console.log(`listening on port: ${PORT}`);
});
