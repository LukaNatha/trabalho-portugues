const start = document.getElementById("iniciar");
const quiz = document.getElementById("quiz");
const timerHTML = document.getElementById("timer");

let atual = 1;
let pontos = 0;
let tempoPergunta = 30;
let intervalo;


let tempoTotal = 0;
let cronometro;

function iniciarCronometro() {
    tempoTotal = 0;
    cronometro = setInterval(() => {
        tempoTotal++;
    }, 1000);
}

function iniciarTimer() {
    tempoPergunta = 30;
    timerHTML.innerText = `Tempo: ${tempoPergunta}s`;
    intervalo = setInterval(() => {
        tempoPergunta--;
        timerHTML.innerText = `Tempo: ${tempoPergunta}s`;
        if (tempoPergunta === 0) {
            clearInterval(intervalo);
            passarPergunta();
        }
    }, 1000);
}

function passarPergunta() {
    const pAnterior = document.getElementById("p" + atual);
    if (pAnterior) pAnterior.style.display = "none";
    
    atual++;
    const proxima = document.getElementById("p" + atual);

    if (proxima) {
        proxima.style.display = "block";
        iniciarTimer();
    } else {
        finalizarQuiz();
    }
}

function finalizarQuiz() {
    clearInterval(cronometro);
    const nome = document.getElementById("nome").value;
    
    quiz.style.display = "none";
    timerHTML.style.display = "none";

    fetch("/salvar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            nome: nome,
            pontuacao: pontos,
            tempo: tempoTotal
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.erro) {
            alert(data.erro);
            window.location.reload();
        } else {
            exibirResultado(nome);
        }
    });
}

function exibirResultado(nome) {
    document.body.innerHTML = `
        <div id="resultado">
            <h2>Parabéns, ${nome}!</h2>
            <p>Pontos: ${pontos}/17 | Tempo Total: ${tempoTotal}s</p>
        </div>
        <div id="ranking-container" style="background:#f5efe6; padding:20px; border-radius:10px; color:#3a2a1a; max-width:500px; margin:20px auto;">
            <h3>🏆 TOP 42 RANKING</h3>
            <table style="width:100%">
                <thead>
                    <tr><th>#</th><th>Nome</th><th>Pontos</th><th>Tempo</th></tr>
                </thead>
                <tbody id="ranking-body"></tbody>
            </table>
            <button onclick="window.location.reload()">Jogar de novo</button>
        </div>
    `;
    carregarRanking();
}

function carregarRanking() {
    fetch("/ranking")
        .then(r => r.json())
        .then(dados => {
            const tbody = document.getElementById("ranking-body");
            tbody.innerHTML = dados.map((item, i) => `
                <tr style="border-bottom:1px solid #ccc">
                    <td>${i + 1}</td>
                    <td>${item.nome}</td>
                    <td>${item.pontuacao}/17</td>
                    <td>${item.tempo}s</td>
                </tr>
            `).join("");
        });
}

start.addEventListener("click", () => {
    const nomeInput = document.getElementById("nome");
    if (nomeInput.value.trim() === "") {
        alert("Digite seu nome!");
        return;
    }
    
    document.getElementById("galeria").style.display = "none";
    document.getElementById("secao").style.display = "none";
    document.getElementById("duvidas").style.display = "none";
    nomeInput.style.display = "none";
    start.style.display = "none";

    quiz.style.display = "block";
    document.getElementById("p1").style.display = "block";

    iniciarCronometro();
    iniciarTimer();
});

quiz.addEventListener("click", (event) => {
    if (event.target.tagName === "BUTTON") {
        clearInterval(intervalo);
        if (event.target.dataset.correta === "true") pontos++;
        passarPergunta();
    }
});
