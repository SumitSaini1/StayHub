// public/js/formValidation.js
/*

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("form-new");

  if (!form) return; // prevent error if this script runs on other pages

  form.addEventListener("submit", function (e) {
    let isValid = true;
    let messages = [];

    const title = document.getElementById("title");
    if (title.value.trim().length < 3) {
      isValid = false;
      messages.push("Title must be at least 3 characters.");
    }

    const description = document.getElementById("description");
    if (description.value.trim().length < 10) {
      isValid = false;
      messages.push("Description must be at least 10 characters.");
    }

    const imageUrl = document.getElementById("imageUrl");
    if (imageUrl.value.trim() !== "") {
      try {
        new URL(imageUrl.value);
      } catch (_) {
        isValid = false;
        messages.push("Image URL must be a valid URL.");
      }
    }

    const price = document.getElementById("price");
    if (price.value <= 0) {
      isValid = false;
      messages.push("Price must be a positive number.");
    }

    const country = document.getElementById("country");
    if (country.value.trim().length < 2) {
      isValid = false;
      messages.push("Country must be at least 2 characters.");
    }

    const location = document.getElementById("location");
    if (location.value.trim().length < 2) {
      isValid = false;
      messages.push("Location must be at least 2 characters.");
    }

    if (!isValid) {
      e.preventDefault();
      alert(messages.join("\n"));
    }
  });
});
*/


(() => {
  'use strict'

  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()