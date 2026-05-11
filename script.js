const start = document.getElementById("iniciar");
const quiz = document.getElementById("quiz");
const timerHTML = document.getElementById("timer");

let atual = 1;
let pontos = 0;
let tempoPergunta = 30;
let intervalo;
let tempoTotal = 0;
let cronometroGlobal;

function iniciarCronometroGlobal() {
    tempoTotal = 0;
    cronometroGlobal = setInterval(() => {
        tempoTotal++;
    }, 1000);
}

function iniciarTimerPergunta() {
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
        iniciarTimerPergunta();
    } else {
        finalizarQuiz();
    }
}

function finalizarQuiz() {
    clearInterval(cronometroGlobal);
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
    .then(() => {
        exibirRankingFinal(nome);
    })
    .catch(err => {
        console.error("Erro ao salvar:", err);
        exibirRankingFinal(nome);
    });
}

function exibirRankingFinal(nome) {
    document.body.innerHTML = `
        <div id="resultado">
            <h2 style="color: #f5c842;">${nome}, quiz concluído!</h2>
            <p style="color: #fff;">Você acertou ${pontos} de 17 questões em ${tempoTotal} segundos.</p>
        </div>
        
        <div id="ranking-box" style="background: #f5efe6; padding: 20px; border-radius: 10px; max-width: 500px; margin: 30px auto; color: #3a2a1a;">
            <h2 style="margin-top: 0;">🏆 Top 42 Jogadores</h2>
            <table style="width: 100%; border-collapse: collapse; text-align: left;">
                <thead>
                    <tr style="border-bottom: 2px solid #3a2a1a;">
                        <th style="padding: 8px;">#</th>
                        <th style="padding: 8px;">Nome</th>
                        <th style="padding: 8px;">Pontos</th>
                        <th style="padding: 8px; text-align: right;">Tempo</th>
                    </tr>
                </thead>
                <tbody id="ranking-body"></tbody>
            </table>
            <button onclick="window.location.reload()" style="margin-top: 20px; padding: 10px 20px; cursor: pointer;">Tentar Novamente</button>
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
                <tr style="border-bottom: 1px solid #d9cfc5;">
                    <td style="padding: 8px;">${i + 1}º</td>
                    <td style="padding: 8px;">${item.nome}</td>
                    <td style="padding: 8px;">${item.pontuacao}/17</td>
                    <td style="padding: 8px; text-align: right;">${item.tempo}s</td>
                </tr>
            `).join("");
        });
}

start.addEventListener("click", () => {
    const nomeVal = document.getElementById("nome").value.trim();
    if (!nomeVal) {
        alert("Por favor, digite seu nome.");
        return;
    }

    document.getElementById("galeria").style.display = "none";
    document.getElementById("secao").style.display = "none";
    document.getElementById("duvidas").style.display = "none";
    document.getElementById("nome").style.display = "none";
    start.style.display = "none";

    quiz.style.display = "block";
    document.getElementById("p1").style.display = "block";
    
    iniciarCronometroGlobal();
    iniciarTimerPergunta();
});

quiz.addEventListener("click", (event) => {
    if (event.target.tagName === "BUTTON") {
        clearInterval(intervalo);
        if (event.target.dataset.correta === "true") pontos++;
        passarPergunta();
    }
});
