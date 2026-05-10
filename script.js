const start = document.getElementById("iniciar");
const quiz = document.getElementById("quiz");
const timerHTML = document.getElementById("timer");

let atual = 1;
let pontos = 0;
let tempo = 30;
let intervalo;

function iniciarTimer() {
    tempo = 30;
    timerHTML.innerText = `Tempo: ${tempo}s`;

    intervalo = setInterval(() => {
        tempo--;
        timerHTML.innerText = `Tempo: ${tempo}s`;

        if (tempo === 0) {
            clearInterval(intervalo);
            passarPergunta();
        }
    }, 1000);
}

function passarPergunta() {
    const perguntaAtual = document.getElementById("p" + atual);
    if (perguntaAtual) perguntaAtual.style.display = "none";

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
    const nome = document.getElementById("nome").value;
    quiz.style.display = "none";
    timerHTML.style.display = "none";
    fetch("/salvar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            nome: nome,
            pontuacao: pontos
        })
    })
    .then(response => {
        if (response.ok) {
            document.body.innerHTML = `
                <div id="resultado">
                    <h2 style="color: #f5c842;">${nome}, você terminou o quiz!</h2>
                    <p style="color: #aaaaaa;">Você fez <strong>${pontos}</strong> de 17 pontos.</p>
                </div>

                <div id="ranking" style="background-color: #f5efe6; padding: 20px; margin: 40px auto; max-width: 500px; border-radius: 10px;">
                    <h2 style="color: #3a2a1a; margin-bottom: 20px;">🏆 Ranking Top 20</h2>
                    <table style="width: 100%; border-collapse: collapse; text-align: left;">
                        <thead>
                            <tr style="border-bottom: 2px solid #3a2a1a;">
                                <th style="padding: 10px;">Pos.</th>
                                <th style="padding: 10px;">Nome</th>
                                <th style="padding: 10px; text-align: right;">Pontos</th>
                            </tr>
                        </thead>
                        <tbody id="ranking-body">
                            </tbody>
                    </table>
                    <br>
                    <button onclick="window.location.reload()" style="padding: 10px 20px; cursor: pointer; background: #3a2a1a; color: white; border: none; border-radius: 5px;">Jogar Novamente</button>
                </div>
            `;
            carregarRanking();
        }
    })
    .catch(error => {
        console.error("Erro ao salvar pontuação:", error);
        alert("Erro ao conectar com o servidor.");
    });
}
start.addEventListener("click", () => {
    const nome = document.getElementById("nome").value;

    if (nome.trim() === "") {
        alert("Digite seu nome");
        return;
    }
    document.getElementById("galeria").style.display = "none";
    document.getElementById("secao").style.display = "none";
    document.getElementById("duvidas").style.display = "none";
    document.getElementById("nome").style.display = "none";
    document.getElementById("iniciar").style.display = "none";
    quiz.style.display = "block";
    document.getElementById("p1").style.display = "block";

    iniciarTimer();
});
quiz.addEventListener("click", (event) => {
    if (event.target.tagName === "BUTTON") {
        clearInterval(intervalo);
        if (event.target.dataset.correta === "true") {
            pontos++;
        }

        passarPergunta();
    }
});

function carregarRanking() {
    fetch("/ranking")
        .then(r => r.json())
        .then(dados => {
            const tbody = document.getElementById("ranking-body");
            if (!tbody) return;

            if (dados.length === 0) {
                tbody.innerHTML = '<tr><td colspan="3" style="text-align:center; color:#888; padding: 20px;">Nenhuma pontuação ainda.</td></tr>';
                return;
            }

            tbody.innerHTML = dados.map((item, i) => {
                const medalha = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : (i + 1);
                return `
                <tr style="border-bottom: 1px solid #d9cfc5;">
                    <td style="padding: 10px; color: #3a2a1a;">${medalha}</td>
                    <td style="padding: 10px; color: #3a2a1a;">${item.nome}</td>
                    <td style="padding: 10px; text-align: right; color: #3a2a1a; font-weight: bold;">${item.pontuacao}/17</td>
                </tr>`;
            }).join("");
        })
        .catch(err => {
            console.error("Erro ao carregar ranking:", err);
            const tbody = document.getElementById("ranking-body");
            if (tbody) tbody.innerHTML = '<tr><td colspan="3" style="text-align:center; color:red;">Erro ao carregar ranking.</td></tr>';
        });
}
