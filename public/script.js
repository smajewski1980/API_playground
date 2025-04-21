const form = document.querySelector("#create-user-form");
const btnSubmit = document.querySelector("#submit");
const btnCreateUser = document.querySelector(".btn-create-user");
const btnCreateCancel = document.querySelector(".btn-create-cancel");
const messageDiv = document.querySelector(".home-message");
const loginForm = document.getElementById("login-form");
const btnLoginForm = document.querySelector(".btn-login-form");
const loginUserVal = document.getElementById("name");
const loginPassVal = document.getElementById("password");
const btnNavCart = document.querySelector("#home-nav a:nth-child(3)");
const btnOrders = document.querySelector("nav a:nth-child(4)");

setCartItemCount();

loginStatus(
  [btnNavCart, btnLogout, btnOrders],
  [btnNavCart, btnLogout, btnOrders]
);

function handleSubmit(e) {
  e.preventDefault();
  const formData = new FormData(form);
  const formVals = Object.fromEntries(formData.entries());
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formVals),
  };
  fetch("/user", options).then(async (res) => {
    console.log("post request sent");
    let tempData = await res.json();
    processResponse(tempData);
    // console.log(tempData);
  });
  form.reset();
  handleCreateCancel();

  setTimeout(() => {
    messageDiv.innerText = "";
  }, 5000);
  // console.log(formVals);
}

function processResponse(data) {
  let newId = data[0].id;
  messageDiv.innerText = `user created: new id is ${newId}`;
}

function handleCreateUser() {
  form.style.display = "block";
  loginForm.style.display = "none";
  btnCreateCancel.addEventListener("click", handleCreateCancel);
}

function handleCreateCancel() {
  form.style.display = "none";
  loginForm.style.display = "block";
}

function displayResponse(data) {
  messageDiv.innerHTML = data;
}

function handleLoginForm(e) {
  e.preventDefault();
  const name = loginUserVal.value;
  const password = loginPassVal.value;
  const body = {
    username: name,
    password: password,
  };
  const options = {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  };
  fetch("/login", options)
    .then((res) => {
      if (!res.ok) {
        messageDiv.innerHTML = "Nope, try again!";
        setTimeout(() => {
          messageDiv.innerHTML = "";
        }, 2500);
      } else {
        return res.json();
      }
    })
    .then((res) => {
      if (res[0].name) {
        loginForm.style.display = "none";
        messageDiv.innerHTML = `${res[0].name} is now logged in.`;
        setTimeout(() => {
          messageDiv.innerHTML = "";
        }, 3000);
        loginStatus(
          [btnNavCart, btnLogout, btnOrders],
          [btnNavCart, btnLogout, btnOrders]
        );
        loginUserVal.value = "";
        loginPassVal.value = "";
      }
    })
    .catch((err) => {
      console.log(err);
      // res.status(err.statusCode).json(err);
    });
}

function handleLogout() {
  const logout = fetch("/logout", { method: "POST" });
  loginForm.style.display = "block";
  avatar.src = "";
  loginStatus([], [btnNavCart, btnLogout, btnOrders]);
  setCartItemCount();
}

btnLogout.addEventListener("click", handleLogout);
btnSubmit.addEventListener("click", handleSubmit);
btnLoginForm.addEventListener("click", handleLoginForm);
btnCreateUser.addEventListener("click", handleCreateUser);
