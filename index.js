const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const user = require("./routes/user");
const product = require("./routes/product");
const cart = require("./routes/cart");
const order = require("./routes/order");
const session = require("express-session");
const siteCounter = require("./routes/site_counter");
const dashboard = require("./routes/dashboard");

io.on("connection", (socket) => {
  console.log("connected through socket id:" + socket.id);
  console.log(socket);
});

app.use(
  session({
    secret: "isYouCrazy!!",
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 5e6,
    },
  })
);
app.use(express.static("public"));
app.use(express.json());
app.use("/user", user);
app.use("/product", product);
app.use("/cart", cart);
app.use("/order", order);
app.use("/site_counter", siteCounter);
app.use("/dashboard", dashboard);

app.post("/login", async (req, res, next) => {
  const { body } = req;
  const { username, password } = body;
  const getUser = await fetch(`http:localhost:5500/user/${username}`);
  const user = await getUser.json();
  // console.log(user);
  if (!user[0]) {
    const err = new Error("no user by that name");
    next(err);
    return;
  } else if (user[0].password === password) {
    console.log("login successful!");
    req.session.visited = true;
    req.session.user = user[0].name;
    req.session.userObj = user[0];
    res.status(200).send(JSON.stringify(user));
    return;
  } else {
    const err = new Error("wrong password");
    next(err);
  }
});

app.post("/logout", (req, res) => {
  const user = req.session.user;
  console.log(`${user} has logged out`);
  req.session.destroy();
  res.send({ msg: "session ended" });
});

app.get("/login/status", (req, res, next) => {
  return req.session.userObj
    ? res.status(200).send(req.session.userObj)
    : res.status(401).send({ msg: "not authenticated" });
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send(err.message);
});

const PORT = process.env.PORT || 5500;
server.listen(PORT, () => {
  console.log(`listening on port: ${PORT}`);
});
