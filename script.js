const start = document.getElementById("iniciar");

start.addEventListener("click", () => {
  document.getElementById("quiz").style.display="block"
});

const nome = document.getElementById("nome").value;

if (nome === ""){
  alert("digite seu nome")
  return;
}
