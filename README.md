# 🤖 Watson Orchestrate Demo - Sync Workflow (Mock)

Este projeto é uma **Prova de Conceito (PoC)** que simula uma automação de "Quick Wins" utilizando a lógica do IBM Watson Orchestrate.

O objetivo é demonstrar como uma orquestração automatizada pode integrar dois sistemas distintos (Gestão de Ponto e Gestão de Projetos) para sincronizar horas trabalhadas e facilitar o controle de budget.

---

## 📋 Cenário de Negócio

A automação resolve o problema de **entrada manual de dados** entre sistemas desconectados:

1.  **Origem (Certponto):** Sistema onde os funcionários registram suas horas.
2.  **Destino (Clarizen):** Sistema de gestão de projetos onde as horas precisam ser alocadas.
3.  **Ação:** O "Watson" (nosso script) lê os dados da origem, processa as regras de negócio e consolida o relatório para o destino.

---

## 🚀 Funcionalidades

* **Skills Mockadas:** Simulação de chamadas de API para leitura de arquivos JSON locais.
* **Workflow de Sincronização:** Lógica central que cruza dados de *Employees*, *Timesheets* e *Projects*.
* **Dashboard Interativo:** Interface web simples para executar a automação com um clique e visualizar os resultados em tempo real.
* **CLI Mode:** Opção de rodar a automação via terminal para testes rápidos.

---

## 🛠️ Tecnologias Utilizadas

* **Node.js** (Runtime Environment)
* **Express** (Servidor Web Simples)
* **HTML5 / Bootstrap 5** (Interface do Dashboard)
* **JSON** (Armazenamento de dados mockados)

---

## 📂 Estrutura do Projeto

```text
watson-orchestrate-demo/
├── data/
│   └── mock/              # "Banco de dados" (arquivos JSON)
│       ├── employees.json
│       ├── projects.json
│       └── timesheets.json
├── src/
│   ├── skills/            # Funções que simulam conexões com APIs
│   ├── workflows/         # Lógica de orquestração (Business Logic)
│   └── dashboard/         # Servidor e Interface Web
│       ├── public/
│       └── mock-server.js
├── demo.js                # Script para execução via terminal
├── package.json
└── README.md

 ```code
  node demo.js
 ```

 ```code
  node src/dashboard/mock-server.js
  ```