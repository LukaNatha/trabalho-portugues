const start = document.getElementById("iniciar");
const quiz = document.getElementById("quiz");
const timerHTML = document.getElementById("timer");

let atual = 1;
let pontos = 0;
let tempo = 30;
let intervalo;

// função do timer
function iniciarTimer() {

  tempo = 30;
  timerHTML.innerText = `Tempo: ${tempo}s`;

  intervalo = setInterval(() => {

    tempo--;

    timerHTML.innerText = `Tempo: ${tempo}s`;

    // acabou o tempo
    if (tempo === 0) {

      clearInterval(intervalo);

      passarPergunta();
    }

  }, 1000);
}

// função para trocar de pergunta
function passarPergunta() {

  document.getElementById("p" + atual).style.display = "none";

  atual++;

  const proxima = document.getElementById("p" + atual);

  if (proxima) {

    proxima.style.display = "block";

    iniciarTimer();

  } else {

    const nome = document.getElementById("nome").value;

    quiz.style.display = "none";
    timerHTML.style.display = "none";

    document.body.innerHTML += `
      <div id="resultado">
        <h2>${nome}, você terminou o quiz!</h2>
        <p>Você fez ${pontos} de 17 pontos.</p>
      </div>
    `;
  }
}

start.addEventListener("click", () => {

  const nome = document.getElementById("nome").value;

  if (nome === "") {
    alert("Digite seu nome");
    return;
  }

  // esconder conteúdo inicial
  document.getElementById("galeria").style.display = "none";
  document.getElementById("secao").style.display = "none";
  document.getElementById("duvidas").style.display = "none";
  document.getElementById("nome").style.display = "none";
  document.getElementById("iniciar").style.display = "none";

  // mostrar quiz
  quiz.style.display = "block";
  document.getElementById("p1").style.display = "block";

  iniciarTimer();
});

// clique nas respostas
quiz.addEventListener("click", (event) => {

  if (event.target.tagName === "BUTTON") {

    clearInterval(intervalo);

    // acertou?
    if (event.target.dataset.correta === "true") {
      pontos++;
    }

    passarPergunta();
  }
});
