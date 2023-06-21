const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const data = {
    email: email,
    password: password,
  };

  fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((result) => {
      if (result.token) {
        localStorage.setItem("token", result.token);
        window.location.href = "../index.html";
      }
      
      else {
        alert("Erreur dans l’identifiant ou le mot de passe");
      }
    });
});
