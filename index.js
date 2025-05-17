require("dotenv").config();
const express = require("express");
const app = express();

const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const session = require("express-session");
const passport = require("passport");
require("./passport");

const user = require("./routes/user");
const product = require("./routes/product");
const cart = require("./routes/cart");
const order = require("./routes/order");
const siteCounter = require("./routes/site_counter");
const dashboard = require("./routes/dashboard");

io.on("connection", (socket) => {
  console.log("connected through socket id:" + socket.id);
  console.log(socket);
});
const Socket = require("./utils/Socket").socket;
const checkLoggedIn = require("./middleware/check_logged_in");

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
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static("public"));
app.use(express.json());
app.use("/user", user);
app.use("/product", product);
app.use("/cart", cart);
app.use("/order", order);
app.use("/site_counter", siteCounter);
app.use("/dashboard", dashboard);

app.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
  }),
  (req, res, next) => {
    res.status(200).send(JSON.stringify(req.user));
  }
);

app.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      console.log(err);
    }
    res.redirect("/user");
  });
});

app.get("/login/status", checkLoggedIn, (req, res, next) => {
  return req.user
    ? res.status(200).send(req.user)
    : res.status(401).send({ msg: "not authenticated" });
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send(err.message);
});

const PORT = process.env.PORT || 5500;
server.listen(PORT, () => {
  console.log(`listening on port: ${PORT}`);
  Socket.setServer(server);
  Socket.createConnection();
});
