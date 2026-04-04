document.getElementById("loginForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const usuario = document.getElementById("usuario").value;
  const password = document.getElementById("password").value;

  // Cargar archivo JSON con usuarios
  fetch("data/users.json")
    .then(response => response.json())
    .then(data => {
      const user = data.find(u => u.usuario === usuario && u.password === password);

      if (user) {
        // Redirigir si login correcto
        window.location.href = "Index.html";
      } else {
        alert("Usuario o contraseña incorrectos");
      }
    })
    .catch(error => console.error("Error cargando usuarios:", error));
});
