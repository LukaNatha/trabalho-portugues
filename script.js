const start = document.getElementById("iniciar");
const quiz = document.getElementById("quiz");

let atual = 1;
let pontos = 0;

// botão iniciar
start.addEventListener("click", () => {

  const nome = document.getElementById("nome").value;

  if (nome === "") {
    alert("Digite seu nome");
    return;
  }

  quiz.style.display = "block";
});

// clique nas respostas
quiz.addEventListener("click", (event) => {

  // verifica se clicou em um botão
  if (event.target.tagName === "BUTTON") {

    // verifica se acertou
    if (event.target.dataset.correta === "true") {
      pontos++;
    }

    // esconde pergunta atual
    document.getElementById("p" + atual).style.display = "none";

    atual++;

    // próxima pergunta
    const proxima = document.getElementById("p" + atual);

    if (proxima) {

      proxima.style.display = "block";

    } else {

      // pega o nome
      const nome = document.getElementById("nome").value;

      // esconde quiz
      quiz.style.display = "none";

      // cria resultado no HTML
      document.body.innerHTML += `
        <div id="resultado">
          <h2>${nome}, você terminou o quiz!</h2>
          <p>Você fez ${pontos} de 17 pontos.</p>
        </div>
      `;
    }
  }
});
