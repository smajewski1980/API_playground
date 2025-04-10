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

app.post("/login", async (req, res) => {
  const { body } = req;
  const { username, password } = body;
  console.log(username + " : " + password);
  const getUserResponse = await fetch(`http:localhost:5500/user/${username}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username: username, pw: password }),
  });
  const user = await getUserResponse.json();
  if (!user[0]) {
    res.status(401).send("bad request!");
    return;
  } else if (user[0].password === password) {
    console.log("login successful!");
    // console.log(req.session);
    req.session.visited = true;
    req.session.user = user;
    res.status(200).send(user);
    return;
  } else {
    res.status(401).send({ message: "something else went wrong" });
  }
});

app.post("/logout", (req, res) => {
  req.session.destroy();
  res.send({ msg: "session ended" });
});

app.get("/login/status", (req, res) => {
  req.sessionStore.get(req.sessionID, (err, session) => {
    console.log("data is moving around...");
  });
  return req.session.user
    ? res.status(200).send({ msg: req.session.user[0].name })
    : res.status(401).send({ msg: "not authenticated" });
});

const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
  console.log(`listening on port: ${PORT}`);
});
