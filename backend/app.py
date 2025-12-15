import os
from flask import Flask, jsonify
from dotenv import load_dotenv
from cloudant_client import get_cloudant

load_dotenv()

app = Flask(__name__)
cloudant = get_cloudant()

DB_NAME = os.getenv("CLOUDANT_DB")

@app.route("/api/health")
def health():
    return jsonify({"status": "ok"})

@app.route("/api/projects")
def get_projects():
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
