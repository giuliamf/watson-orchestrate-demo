import os
from flask import Flask, jsonify
from dotenv import load_dotenv, find_dotenv
from cloudant_client import get_cloudant

load_dotenv(find_dotenv())

app = Flask(__name__)

try:
    cloudant = get_cloudant()
except Exception as e:
    print(f"Aviso: Não foi possível conectar ao Cloudant: {e}")
    cloudant = None

DB_NAME = os.getenv("CLOUDANT_DB")

@app.route("/api/health")
def health():
    return jsonify({"status": "ok"})

@app.route("/api/projects")
def get_projects():
    if cloudant is None:
        return jsonify({"error": "Conexão com Cloudant não estabelecida. Verifique as credenciais no arquivo .env"}), 500

    try:
        response = cloudant.post_all_docs(
            db=DB_NAME,
            include_docs=True
        ).get_result()

        projects = [row["doc"] for row in response["rows"]]
        return jsonify(projects)

    except Exception as e:
        print(f"Erro no endpoint /api/projects: {e}")
        return jsonify({"error": f"Erro ao buscar projetos: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=int(os.getenv("PORT", 8080)),
        debug=True
    )
