const start = document.getElementById("iniciar");

start.addEventListener("click", () => {

  const nome = document.getElementById("nome").value;
  
  if (nome === ""){
    alert("digite seu nome")
    return;
  }
    
  document.getElementById("quiz").style.display="block"
});

const resposta = document.getElementById("quiz");

let atual = 1

resposta.addEventListener("click", () => {
  document.getElementById("p" + atual).style.display="none";
  atual++;

  const proxima = document.getElementById("p" + atual)

  if(proxima) {
    proxima.style.display="block";
  } else {
    alert("fim do quiz")
  }});



