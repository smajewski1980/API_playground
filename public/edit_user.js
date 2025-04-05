const nameInput = document.querySelector("#name");
const pwInput = document.querySelector("#password");
const btnSubmit = document.querySelector("button");
const messageElem = document.querySelector("#login-message");

function handleSubmit(e) {
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
    messageElem.innerHTML = await res.text();
    console.log(await res.text());
  });
}

btnSubmit.addEventListener("click", handleSubmit);
