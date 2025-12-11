# 🐾 **PatasConfia – DApp de Adoção de Pets via NFTs**

O **PatasConfia** é um DApp construído como projeto da disciplina CESS/UnB que utiliza **smart contracts**, **NFTs ERC-721**, **React**, **Pinata** e **ethers.js** para criar um sistema seguro, transparente e descentralizado de adoção de animais.

A plataforma permite que **doadores registrem pets**, **adotantes solicitem adoção**, e todo fluxo é registrado na blockchain.

---

#  **Resumo do Projeto**

Este projeto cria um sistema descentralizado onde:

* Doadores criam contas e registram animais como NFTs.
* Adotantes solicitam adoção.
* Doadores aprovam ou rejeitam solicitações.
* Todo histórico fica registrado na blockchain.
* As imagens dos pets são armazenadas no IPFS utilizando **Pinata**.

---

# **Fluxo Básico da Aplicação**

## 🌼 **1. Registro de Usuário**

O usuário escolhe seu tipo de conta:

* **Doador**
* **Adotante**

Esse registro é gravado no smart contract `PatasConfiaUsers`.

---

## 🐕 **2. Criar Pets (apenas doadores)**

O doador pode:

* Fazer upload da imagem do animal
* A imagem vai para o **Pinata (IPFS)**
* O Pinata retorna a **hash** usada como `tokenURI`
* O contrato **mint** o NFT do animal

---

## 🏠 **3. Página “Adotar”**

Mostra:

* Pets disponíveis
* Meus pets (pets que o usuário possui)

Cada card possui:

* Foto
* Nome
* Botão **Solicitar Adoção** 

---

## 📋 **4. Página “Solicitações”** (apenas doadores)

Lista solicitações pendentes, com opções:

* ✔️ **Aprovar Adoção**
* ❌ **Rejeitar Adoção**

---

## ❤️ **5. Minhas Adoções**

Se o adotante tiver adoções aprovadas, elas aparecem nesta seção.

---

#  **Ferramentas, Tecnologias e SDKs Utilizados**

### **Frontend**

* **React 19**
* **Vite**
* **Semantic UI React**
* **@tanstack/react-query**
* **wagmi**
* **viem**
* **ethers.js**

### **Backend Web3**

* Solidity
* OpenZeppelin ERC721
* Hardhat (se estiver usando)

### **Armazenamento**

* **Pinata** para armazenar:

  * imagens dos pets
  * metadata JSON (tokenURI)

### **Dependências do Projeto**

# **Como Executar o Projeto**

```txt
dependencies:
@tanstack/react-query 5.90.11
@uidotdev/usehooks 2.4.1
ethers 5.8.0
react 19.2.0
react-dom 19.2.0
semantic-ui-css 2.5.0
semantic-ui-react 2.1.5
viem 1.21.1
wagmi 1.4.12

devDependencies:
@eslint/js 9.39.1
@types/react 19.2.7
@types/react-dom 19.2.3
@vitejs/plugin-react 5.1.1
eslint 9.39.1
eslint-plugin-react-hooks 7.0.1
eslint-plugin-react-refresh 0.4.24
globals 16.5.0
vite 7.2.4
```

---

# **Configuração do Pinata (Obrigatório)**

Crie um arquivo **.env** dentro de `frontend/`:

```
VITE_PINATA_JWT=<sua_pinata_jwt_key>
```

A API key é usada para fazer o upload de imagens e gerar o tokenURI.

---

## **1. Fazer deploy dos contratos na rede CESS**

Antes de rodar o frontend, você precisa fazer o deploy dos smart contracts.

###  Passos:

1. Acesse **Remix IDE**
2. Vá em **Deploy & Run Transactions**
3. Em *Environment*, selecione:
   **Injected Provider** (metamask)
4. No MetaMask, selecione a **rede CESS**
5. Faça o deploy dos dois contratos:

   * `PatasConfiaUsers.sol`
   * `PatasConfia.sol` usando o endereço do contrato anterior

Após o deploy, copie os **endereços dos contratos**.

---

## **2. Atualizar os endereços no Frontend**

No arquivo:

```
frontend/src/config.js
```

Substitua:

```
export const USERS_CONTRACT_ADDRESS = "<endereço_do_PatasConfiaUsers>";
export const PETS_CONTRACT_ADDRESS = "<endereço_do_PatasConfia>";
```
Sem isso, o frontend **não consegue conectar com o contrato**.

---

## 1. Entrar na pasta do projeto

```bash
cd patasconfia
cd frontend
```

## 2. Instalar dependências

## 3. Rodar o servidor local

```bash
pnpm dev
```

O frontend abrirá normalmente em:

```
http://localhost:5173
```

---

#  **Qual problema esse projeto resolve?**

O **PatasConfia** resolve:

###  Transparência

Adoções registradas na blockchain não podem ser alteradas.

### Autenticidade

Cada pet é um NFT único, impossível de duplicar.

###  Segurança

As imagens e dados ficam em IPFS, não dependem de um servidor centralizado.

###  Confiança

O fluxo de aprovar/rejeitar adições evita fraudes.

---

# **O que eu aprendi com o projeto**

 Como criar e interagir com **smart contracts Solidity**
 Como gerar NFTs com **ERC721**
 Como usar **Pinata + IPFS** para armazenar imagens
 Como conectar o frontend ao contrato usando **ethers, wagmi e viem**
 Como fazer upload seguro usando **JWT do Pinata**
 Como organizar um projeto Web3 completo do zero
 Como criar um fluxo descentralizado de adoção digital

---



