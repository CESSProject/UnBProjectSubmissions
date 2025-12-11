TraceVault – Armazenamento Seguro com Cadeia de Custódia Digital Imutável

O TraceVault é uma aplicação descentralizada (DApp) desenvolvida para permitir que empresas armazenem, consultem e validem documentos de forma segura, auditável e transparente, utilizando blockchain para garantir a integridade, autenticidade e rastreabilidade de cada interação.

Cada upload, download ou consulta gera um evento registrado na blockchain, criando uma cadeia de custódia digital imutável e protegendo contra fraudes ou alterações não autorizadas.

 Problemas que o TraceVault resolve:

Empresas que lidam com documentos sensíveis enfrentam desafios como:

Risco de perda, alteração ou manipulação de arquivos

Falta de auditoria clara sobre quem acessou ou modificou documentos

Altos custos com infraestrutura centralizada

Dependência de servidores tradicionais

Ausência de um histórico confiável de operações

O TraceVault elimina esses riscos oferecendo:

✔ Auditoria completa
✔ Rastreamento imutável
✔ Transparência total das operações

🧩 Arquitetura da Solução

O sistema é dividido em três camadas principais, mais o contrato inteligente:

1. Frontend (React + Vite)

Responsável por:

Upload de arquivos

Geração automática do hash criptográfico

Consulta de documentos

Download

Exibição dos eventos registrados na blockchain

2. Backend (Node.js + Express + MySQL)

Gerencia:

Recebimento e armazenamento de arquivos

Operações de upload/download usando hash

Registro interno de ações dos usuários

Comunicação com o banco de dados

3. Banco de Dados (MySQL)

Armazena:

Nome original do arquivo

Caminho no servidor

Hash

Tamanho

Data de upload

4. Contrato Inteligente (Solidity – Rede Sepolia)

Responsável por:

Registrar eventos de upload, download e consulta

Manter histórico imutável na blockchain

Garantir integridade e rastreabilidade dos documentos

▶️ Como rodar o projeto localmente
📌 Pré-requisitos

Node.js instalado

NPM instalado

MySQL em execução

Metamask configurada na rede Sepolia

📦 Backend
1. Acesse a pasta:
cd backend

2. Instale dependências:
npm install

3. Rode o servidor:
node server.js

✔ Backend disponível em: http://localhost:3000

🖥️ Frontend
1. Acesse a pasta:
cd tracevault-frontend

2. Instale dependências:
npm install

3. Rode o projeto:
npm run dev

✔ Frontend disponível em: http://localhost:5173

