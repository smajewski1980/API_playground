const form = document.querySelector("#create-user-form");
const btnSubmit = document.querySelector("#submit");
const btnCreateUser = document.querySelector(".btn-create-user");
const btnCreateCancel = document.querySelector(".btn-create-cancel");
const messageDiv = document.querySelector(".home-message");

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
}

function handleCreateCancel() {
  form.style.display = "none";
}

btnSubmit.addEventListener("click", handleSubmit);
btnCreateUser.addEventListener("click", handleCreateUser);
btnCreateCancel.addEventListener("click", handleCreateCancel);
