const form = document.querySelector("form");
const btnSubmit = document.querySelector("button");

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
  });
  form.reset();
  console.log(formVals);
}

btnSubmit.addEventListener("click", handleSubmit);
