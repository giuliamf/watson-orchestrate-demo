# 🟦 SGH - Sistema de Gestão de Horas (IBM Style)

O **SGH** é uma solução Full-Stack para gerenciamento de horas de projetos, integrado com **IBM DB2**.

## 🚀 Funcionalidades Principais

### 👤 Portal do Técnico
* **Lançamento de Horas:** Interface simples para registro de atividades.
* **Gestão de Timesheet:** Visualização semanal e diária.

### 💼 Gestão (PM Dashboard)
* **Gestão de Projetos:** Visualização de projetos e contratos.
* **Audit Logs:** Rastreabilidade.

### 🧠 Backend
* **Go (Golang):** API RESTful.
* **IBM DB2:** Persistência de dados segura e escalável.

---

## 🛠️ Tecnologias Utilizadas

* **Backend:** Go (Golang) 1.24+
* **Web Framework:** Gin Gonic
* **Database:** IBM DB2 (via API REST)
* **Frontend:** React.js + Vite

---

## ⚙️ Configuração e Execução

### Pré-requisitos
* Go instalado.
* Node.js instalado.
* Credenciais de acesso ao IBM DB2 (API Key, URL, Database).

### Configuração do Backend

1.  Navegue até a pasta `backend`.
2.  Copie o arquivo `.env.example` para `.env` e preencha com suas credenciais:
    ```bash
    cp .env.example .env
    ```
3.  Instale as dependências:
    ```bash
    go mod tidy
    ```

### Importação de Dados (Seed)

Para popular o banco de dados com dados iniciais (a partir de `mock_dados_db2.csv`):

1.  Certifique-se de que o arquivo `.env` está configurado corretamente.
2.  Execute o script de importação:
    ```bash
    go run scripts/import_csv.go
    ```
    *Isso criará as tabelas e importará os dados.*

### Rodar o Backend

Na pasta `backend`:

```bash
go run cmd/api/main.go
```
O servidor iniciará em `http://localhost:8080`.

### Rodar o Frontend

1.  Navegue até a pasta `frontend`.
2.  Instale as dependências:
    ```bash
    npm install
    ```
3.  Inicie o servidor de desenvolvimento:
    ```bash
    npm run dev
    ```
4.  Acesse a aplicação no navegador (geralmente `http://localhost:5173`).

---

## 🐳 Docker

Para rodar com Docker, certifique-se de passar as variáveis de ambiente necessárias para o container.
