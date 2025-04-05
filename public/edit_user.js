const nameInput = document.querySelector("#name");
const pwInput = document.querySelector("#password");
const btnSubmit = document.querySelector("button");
const messageElem = document.querySelector("#login-message");
const loginForm = document.querySelector("#login-form");
const editUserForm = document.querySelector("#edit-user-form");
const editName = document.querySelector("#edit-name");
const editPassword = document.querySelector("#edit-password");
const editEmail = document.querySelector("#edit-email");
const editAddressLine1 = document.querySelector("#edit-address-line-1");
const editAddressLine2 = document.querySelector("#edit-address-line-2");
const editPhone = document.querySelector("#edit-phone");
const editEmailYes = document.querySelector("#edit-email-yes");
const editEmailNo = document.querySelector("#edit-email-no");
const editPhoneYes = document.querySelector("#edit-phone-yes");
const editPhoneNo = document.querySelector("#edit-phone-no");
const btnUpdateUser = document.querySelector("#btn-update-user");
let editId = null;

function generateUserEdit(user) {
  const {
    id,
    name,
    password,
    email,
    address_line_1,
    address_line_2,
    phone,
    prefers_email_notifications,
    prefers_phone_notifications,
  } = user;
  messageElem.innerHTML = "login successful";
  setTimeout(() => {
    messageElem.innerHTML = "";
    loginForm.style.display = "none";
    editId = id;
    editName.value = name;
    editPassword.value = password;
    editEmail.value = email;
    editAddressLine1.value = address_line_1;
    editAddressLine2.value = address_line_2;
    editPhone.value = phone;
    prefers_email_notifications
      ? (editEmailYes.checked = true)
      : (editEmailNo.checked = true);
    prefers_phone_notifications
      ? (editPhoneYes.checked = true)
      : (editPhoneNo.checked = true);
    editUserForm.style.display = "block";
  }, 3000);

  // make put req from button
}

function handleLoginSubmit(e) {
  e.preventDefault();
  const name = nameInput.value;
  const pw = pwInput.value;
  const body = { pw: pw };
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  };
  fetch(`/user/${name}`, options).then(async (res) => {
    const response = await res.json();
    const user = response[0];
    generateUserEdit(user);
  });
}

function handleUpdateUser(e) {
  e.preventDefault();
  const formData = new FormData(editUserForm);
  const formVals = Object.fromEntries(formData.entries());
  formVals.id = editId;
  const options = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formVals),
  };
  fetch("/user", options).then(async (res) => {
    console.log("put request sent");
  });
  editUserForm.reset();
  editId = null;
}

btnSubmit.addEventListener("click", handleLoginSubmit);
btnUpdateUser.addEventListener("click", handleUpdateUser);
