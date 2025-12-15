import os
from flask import Flask, jsonify
from dotenv import load_dotenv
from cloudant_client import get_cloudant

load_dotenv()

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
    if not cloudant:
        return jsonify([
            {
                "_id": "1",
                "name": "Projeto Demo 1", 
                "status": "Em Andamento", 
                "responsible": "João Silva", 
                "description": "Este é um dado fictício pois as credenciais do Cloudant não foram encontradas."
            },
            {
                "_id": "2",
                "name": "Projeto Demo 2", 
                "status": "Concluido", 
                "responsible": "Maria Souza",
                "description": "Configure o arquivo .env com CLOUDANT_APIKEY, CLOUDANT_URL e CLOUDANT_DB para usar dados reais."
            },
            {
                "_id": "3",
                "name": "Novo Website", 
                "status": "Pendente", 
                "responsible": "Carlos Oliveira",
                "description": "Redesign do site corporativo."
            }
        ])

    try:
        response = cloudant.post_all_docs(
            db=DB_NAME,
            include_docs=True
        ).get_result()

        projects = [row["doc"] for row in response["rows"]]
        return jsonify(projects)

    except Exception as e:
        print(e)
        return jsonify({"error": "Erro ao buscar projetos"}), 500

if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=int(os.getenv("PORT", 8080)),
        debug=True
    )
