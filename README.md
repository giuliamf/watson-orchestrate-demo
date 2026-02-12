# 🟦 SGH - Sistema de Gestão de Horas (IBM Style)

O **SGH** é uma solução Full-Stack para gerenciamento de horas de projetos, focado em contratos complexos com **Rate Cards Dinâmicos**. O sistema permite que técnicos lancem horas com feedback de custo em tempo real e que gerentes (PMs) controlem o budget com precisão matemática.

## 🚀 Funcionalidades Principais

### 👤 Portal do Técnico
* **Lançamento de Horas:** Interface simples para registro de atividades.
* **Simulador em Tempo Real:** Ao selecionar o projeto e horário, o sistema calcula instantaneamente o fator de faturamento (ex: "Domingo/Feriado: 2.5x") e projeta o débito.
* **Feedback Visual:** Indicadores coloridos sobre a regra de contrato aplicada.

### 💼 Gestão (PM Dashboard)
* **Gestão de Contratos:** Criação de projetos com regras de multiplicadores personalizáveis (Business Hours, Evening, Night, Weekend, Holiday).
* **Barra de Progresso:** Visualização gráfica do consumo do budget (% Utilizado).
* **Audit Logs:** Rastreabilidade completa de quem lançou, editou ou excluiu registros.
* **CRUD de Projetos:** Criação, Edição e Exclusão de Work Items com confirmação de segurança.

### 🧠 Core (Backend Intelligence)
* **Time Slicing Engine:** O cálculo de faturamento não é apenas "Início x Fim". O sistema fatia o tempo minuto a minuto. Se um técnico trabalha das 17:00 às 19:00, o sistema calcula 1h com taxa comercial e 1h com adicional noturno automaticamente.
* **Arquitetura Unificada:** O Backend em Go serve o Frontend em React, permitindo deploy em um único container.

---

## 🛠️ Tecnologias Utilizadas

* **Backend:** Go (Golang) 1.22+
* **Web Framework:** Gin Gonic
* **Database:** SQLite (com GORM)
* **Frontend:** React.js + Vite
* **Estilização:** CSS Customizado (IBM Carbon Design inspired)
* **Deploy:** Docker & IBM Cloud Code Engine

---

## ⚙️ Como Rodar Localmente

Este projeto utiliza uma arquitetura unificada. O Go serve os arquivos estáticos do React.

### Pré-requisitos
* Go instalado.
* Node.js instalado.

### Passo 1: Construir o Frontend
Vá até a pasta do frontend (onde está o `package.json`):

```bash
npm install
npm run build
```

Isso criará uma pasta chamada `dist`.

### Passo 2: Preparar o Backend
1.  Mova a pasta `dist` gerada no passo anterior para a **raiz** da pasta do backend (onde está o `main.go`).
2.  A estrutura deve ficar assim:
    ```text
    /sgh-backend
      ├── main.go
      ├── api.go
      ├── sgh.db (será criado automaticamente)
      └── dist/
           ├── index.html
           └── assets/
    ```

### Passo 3: Executar
Na raiz do backend, execute:

```bash
go run .
```

Acesse **http://localhost:8080**.

> **Nota:** Se precisar resetar o banco de dados, basta deletar o arquivo `sgh.db` e reiniciar o servidor.

---

## 🐳 Como Rodar com Docker (Recomendado para Demo)

Para garantir que funcione em qualquer máquina sem instalar Go ou Node:

1.  **Construir a imagem:**
    ```bash
    docker build -t sgh-app .
    ```

2.  **Rodar o container:**
    ```bash
    docker run -p 8080:8080 sgh-app
    ```

---

## ☁️ Deploy na IBM Cloud (Code Engine)

Este projeto está pronto para o **IBM Cloud Code Engine** (Serverless Container).

1.  **Login na CLI:**
    ```bash
    ibmcloud login --sso
    ibmcloud target -g Default
    ```

2.  **Enviar imagem para o Container Registry:**
    ```bash
    # Cria o namespace (apenas na primeira vez)
    ibmcloud cr namespace-add sgh-demo
    
    # Constrói e envia a imagem (Se sua conta for BR, use br.icr.io)
    ibmcloud cr build -t us.icr.io/sgh-demo/sgh-app:v1 .
    ```

3.  **Criar a Aplicação:**
    ```bash
    # Cria o projeto
    ibmcloud ce project create --name sgh-project
    ibmcloud ce project select --name sgh-project
    
    # Sobe a aplicação (min-scale 1 evita que o SQLite reset durante a demo)
    ibmcloud ce application create --name sgh-app \
      --image us.icr.io/sgh-demo/sgh-app:v1 \
      --cpu 0.5 --memory 1G \
      --port 8080 \
      --min-scale 1
    ```

---

## 📄 Estrutura de Pastas

* `main.go`: Inicialização do banco, seeds e servidor.
* `api.go`: Rotas da API, lógica de "Time Slicing" e serviço de arquivos estáticos.
* `models/`: Definições das tabelas do banco (Contract, WorkItem, TimeEntry).
* `dist/`: O Frontend compilado (React).
* `Dockerfile`: Receita para criar o container unificado.

---

## 📝 Autor

Desenvolvido para fins de demonstração técnica e gestão de capacidade em projetos Cloud.