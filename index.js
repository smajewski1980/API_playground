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
const checkPw = require("./utils/hashPassword");

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

// app.post("/login", async (req, res, next) => {
//   const { body } = req;
//   const { username, password } = body;
//   const getUser = await fetch(`http:localhost:5500/user/${username}`);
//   const user = await getUser.json();
//   const isPwGood = await checkPw(password, user[0].password);
//   if (!user[0]) {
//     const err = new Error("no user by that name");
//     next(err);
//     return;
//   } else if (isPwGood) {
//     console.log("login successful!");
//     req.session.visited = true;
//     req.session.user = user[0].name;
//     req.session.userObj = user[0];
//     res.status(200).send(JSON.stringify(user));
//     return;
//   } else {
//     const err = new Error("wrong password");
//     next(err);
//   }
// });

app.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    // successRedirect: "/product",
  }),
  (req, res, next) => {
    // console.log("if we get here req.user is: " + JSON.stringify(req.user));
    res.status(200).send(JSON.stringify(req.user));
  }
);

app.post("/logout", (req, res) => {
  const user = req.session.user;
  console.log(`${user} has logged out`);
  req.session.destroy();
  res.send({ msg: "session ended" });
});

app.get("/login/status", checkLoggedIn, (req, res, next) => {
  // console.log(req.user);
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
