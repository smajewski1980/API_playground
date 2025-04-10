const express = require("express");
const app = express();
const user = require("./routes/user");
const product = require("./routes/product");
const session = require("express-session");

app.use(express.static("public"));
app.use(express.json());
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
app.use("/user", user);
app.use("/product", product);

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
    res.status(200).send(user);
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
  // req.sessionStore.get(req.sessionID, (err, session) => {
  //   if (err) {
  //     next(err);
  //   }
  //   console.log("data is moving around...");
  // });
  return req.session.user
    ? res.status(200).send({ msg: req.session.user })
    : res.status(401).send({ msg: "not authenticated" });
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send("errors are whats happening");
});

const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
  console.log(`listening on port: ${PORT}`);
});
