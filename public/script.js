const form = document.querySelector("#create-user-form");
const btnSubmit = document.querySelector("#submit");
const btnCreateUser = document.querySelector(".btn-create-user");
const btnCreateCancel = document.querySelector(".btn-create-cancel");
const messageDiv = document.querySelector(".home-message");
const loginForm = document.getElementById("login-form");
const btnLoginForm = document.querySelector(".btn-login-form");
const loginUserVal = document.getElementById("name");
const loginPassVal = document.getElementById("password");
const loginSpan = document.querySelector(".login-bug span");
const btnLogout = document.getElementById("btn-logout");

let loginStatus = () => {
  fetch("/login/status").then(async (res) => {
    if (res.status === 200) {
      const { msg } = await res.json();
      console.log(msg);
      loginSpan.innerText = msg;
    } else {
      loginSpan.innerText = "No one";
    }
  });
};

loginStatus();

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
}

function handleCreateCancel() {
  form.style.display = "none";
  loginForm.style.display = "block";
}

function displayResponse(data) {
  messageDiv.innerHTML = data.message;
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
  const login = fetch("/login", options).then((res) => {
    // console.log(res);
    // displayResponse(res.json());
    loginStatus();
  });
}

function handleLogout() {
  const logout = fetch("/logout", { method: "POST" });

  loginStatus();
}

btnLogout.addEventListener("click", handleLogout);
btnSubmit.addEventListener("click", handleSubmit);
btnLoginForm.addEventListener("click", handleLoginForm);
btnCreateUser.addEventListener("click", handleCreateUser);
btnCreateCancel.addEventListener("click", handleCreateCancel);
