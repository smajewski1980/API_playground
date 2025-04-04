const form = document.querySelector("form");
const btnSubmit = document.querySelector("button");

function handleSubmit(e) {
  e.preventDefault();
  const formData = new FormData(form);
  console.log(formData);
}

btnSubmit.addEventListener("click", handleSubmit);
