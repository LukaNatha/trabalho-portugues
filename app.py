from flask import Flask, request, jsonify, send_from_directory
import sqlite3
import os

app = Flask(__name__)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB = os.path.join(BASE_DIR, "ranking.db")

def init_db():
    conn = sqlite3.connect(DB)
    c = conn.cursor()
    c.execute("""
        CREATE TABLE IF NOT EXISTS ranking (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT UNIQUE,
            pontuacao INTEGER NOT NULL,
            tempo INTEGER NOT NULL
        )
    """)
    conn.commit()
    conn.close()

init_db()

@app.route("/")
def home():
    return send_from_directory(BASE_DIR, "index.html")

@app.route("/<path:filename>")
def static_files(filename):
    return send_from_directory(BASE_DIR, filename)

@app.route("/salvar", methods=["POST"])
def salvar():
    dados = request.get_json()
    nome = dados.get("nome", "").strip()
    pontuacao = dados.get("pontuacao", 0)
    tempo = dados.get("tempo", 0)

    if not nome:
        return jsonify({"erro": "Nome inválido"}), 400

    conn = sqlite3.connect(DB)
    c = conn.cursor()

    c.execute("SELECT id FROM ranking WHERE nome = ?", (nome,))
    if c.fetchone():
        conn.close()
        return jsonify({"erro": "Nome já usado"}), 400

    try:
        c.execute(
            "INSERT INTO ranking (nome, pontuacao, tempo) VALUES (?, ?, ?)",
            (nome, pontuacao, tempo)
        )
        conn.commit()
    except Exception as e:
        return jsonify({"erro": str(e)}), 500
    finally:
        conn.close()

    return jsonify({"ok": True})

@app.route("/ranking")
def get_ranking():
    conn = sqlite3.connect(DB)
    c = conn.cursor()
    c.execute("""
        SELECT nome, pontuacao, tempo 
        FROM ranking 
        ORDER BY pontuacao DESC, tempo ASC 
        LIMIT 42
    """)
    rows = c.fetchall()
    conn.close()

    return jsonify([{"nome": r[0], "pontuacao": r[1], "tempo": r[2]} for r in rows])

if __name__ == "__main__":
    app.run(debug=True)
