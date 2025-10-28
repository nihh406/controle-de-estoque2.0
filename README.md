#  PDV-App: Sistema de Ponto de Venda e Gestão de Estoque (Versão Otimizada)

<img src="img.README/tela-login.jpg" alt="Descrição da Imagem" width="300"/>

Este projeto foi re-otimizado para garantir uma **demonstração Full-Stack imediata**, focando na lógica de negócio essencial (CRUD, transações e autenticação) sem a complexidade de *frameworks* de build (como React/Vite).

##  Destaques da Arquitetura (Foco na Demonstração)

Este projeto foi estruturado para resolver o desafio de conectar três camadas de forma robusta e simples:

| Camada | Tecnologia | Destaque |
| :--- | :--- | :--- |
| **Front-end** | **HTML5, CSS3, Vanilla JavaScript** | Design limpo e profissional, com roteamento simulado (via `hashchange`) e comunicação direta via `fetch()`. |
| **Back-end (API)** | **Node.js (Express), JWT** | API RESTful com rotas protegidas (Middleware) e lógica de transação de estoque em memória. |
| **Banco de Dados** | **Simulação em Memória** | Simula o comportamento do MySQL (pronto para integrar `mysql2`). Foi um ponto de contingência para garantir o deploy funcional. |

### Recursos de Valor Agregado:

* **Autenticação JWT:** O Front-end envia credenciais, o Back-end retorna um token, e o Front-end usa esse token para acessar rotas como `/produtos` (confirmado na console do navegador).
* **Lógica de Transação de Vendas:** O endpoint `/vendas` verifica o estoque antes de subtrair as quantidades, simulando uma transação atômica.
* **Controle de Estoque:** A tela de Produtos mostra a lista (simulada) e o PDV interage diretamente com o estado do estoque na memória do servidor Node.js.

## ⚙️ Como Rodar o Projeto (Instruções para o Recrutador)

O projeto roda em dois servidores locais (um para a API e um para o Front-end estático).

### 1. Iniciar o Back-end (API)

Abra o terminal na pasta `back-end/` e inicie a API:

```bash
cd back-end
node server.js 
# Deve mostrar: Servidor rodando na porta 3001 (MODO SIMULAÇÃO ATIVO)
