# 🏥 MedVault — Decentralized Medical Data Vault

**Privacy-first. Patient-centered. Built with care. Powered by CESS Network.**

- - -

## 🌐 Project Vision

**MedVault** is more than a decentralized application — it is a statement about how healthcare data _should_ be treated in the digital age.

At its core, MedVault exists to restore what has long been taken away from patients: **true ownership and sovereignty over their own medical data**.

By combining **CESS Network’s Encrypted Decentralized Object Storage (DeOSS)** with **EVM-compatible Smart Contracts**, MedVault removes centralized servers, opaque intermediaries, and trust assumptions that historically put sensitive medical information at risk.

Every design decision in MedVault is guided by one principle: **medical data deserves the same level of protection, dignity, and transparency as human life itself**.

- - -

## 🌍 Why MedVault Matters

Healthcare data breaches, fragmented records, and lack of patient control are not just technical failures — they are ethical failures.

MedVault addresses these problems by offering:

*   **Patient Sovereignty** — Data ownership is enforced cryptographically.
*   **Zero Trust Architecture** — No centralized backend, no silent intermediaries.
*   **Transparency & Auditability** — Every access is verifiable and traceable.
*   **Resilience** — Built on decentralized storage and blockchain logic.

CESS Network plays a fundamental role by providing a **trustless, verifiable, and globally distributed storage layer** tailored for sensitive data.

- - -

## 🧠 Architecture Overview

### Client-Side Front-End

The front-end is the heart of MedVault. All cryptography, identity verification, file hashing, and signature generation occur directly in the user’s browser.

### On-Chain Smart Contract

The smart contract enforces ownership, permissions, and time-limited access rules. It acts as the immutable source of truth for who owns what and who is allowed to access it.

### CESS DeOSS Storage

Encrypted medical files are stored off-chain using CESS DeOSS, benefiting from fragmentation, geo-redundancy, deduplication, and **PoDR²**.

- - -

## 📤 Secure Upload & On-Chain Registration

Files are uploaded directly from the browser to CESS DeOSS, authenticated through cryptographic signatures — without exposing private keys.

```
PUT /file
# Required headers:
# Territory
# Account
# Message
# Signature
```

After upload, immutable metadata is recorded on-chain, guaranteeing ownership, integrity, and proof-of-existence.

- - -

## 🕒 Time-Limited Access Control

MedVault allows patients to grant **temporary, revocable access** to healthcare professionals.

Access automatically expires, eliminating forgotten permissions and reducing long-term exposure risks.

- - -

## 📜 Auditing & Transparency

Every interaction generates smart contract events that can be independently verified. This creates a transparent audit trail that strengthens trust between patients and healthcare professionals.

- - -

## 🚀 Future Improvements & Roadmap

MedVault is designed as a living project, with a clear vision for future growth.

### 🩺 Professional Doctor Interface

One of the most important upcoming improvements is the implementation of a **dedicated Doctor Page**.

This professional interface will allow authorized doctors and institutions to:

*   View medical files shared with them by patients
*   Clearly see access expiration times
*   Maintain a verifiable access history

### 🔐 CESS PReT Integration

Future versions will integrate **CESS Proxy Re-Encryption (PReT)**, enabling secure key delegation without exposing private encryption keys.

### 📊 Advanced Analytics & UX Improvements

Planned enhancements include usability refinements, accessibility improvements, and visual audit dashboards.

These improvements aim to make MedVault not only secure, but also welcoming and easy to use for patients and professionals alike.

- - -

## 📄 License

This project is licensed under the **MIT License**.

- - -

# 🇧🇷 MedVault — Cofre de Arquivos Médicos Descentralizados

**Privacidade em primeiro lugar. O paciente no centro. Construído com cuidado. Powered by CESS Network.**

## 🌐 Visão do Projeto

O **MedVault** é mais do que uma aplicação descentralizada — é uma declaração sobre como os dados de saúde _devem_ ser tratados na era digital.

Em sua essência, o MedVault existe para devolver aos pacientes algo fundamental: **a verdadeira soberania sobre seus próprios dados médicos**.

Ao combinar o **Armazenamento Descentralizado Criptografado (DeOSS)** da CESS Network com **Smart Contracts compatíveis com EVM**, o MedVault elimina servidores centrais, intermediários opacos e suposições de confiança que historicamente colocam dados médicos em risco.

Cada decisão de design do MedVault é guiada por um princípio: **dados médicos merecem o mesmo nível de proteção, dignidade e transparência que a vida humana**.

## 🌍 Por que o MedVault é Importante

Vazamentos de dados, prontuários fragmentados e a falta de controle do paciente não são apenas falhas técnicas — são falhas éticas.

O MedVault enfrenta esses problemas oferecendo:

*   **Soberania do Paciente** — Propriedade garantida criptograficamente.
*   **Arquitetura Zero Trust** — Sem backend centralizado.
*   **Transparência e Auditoria** — Todo acesso é verificável.
*   **Resiliência** — Baseado em blockchain e armazenamento descentralizado.

## 🚀 Melhorias Futuras

O MedVault foi concebido como um projeto vivo, com evolução contínua.

O próximo grande passo é a implementação da **Interface Profissional do Médico**, permitindo colaboração segura, ética e transparente entre pacientes e profissionais de saúde.

Com a integração do **CESS PReT** e melhorias de usabilidade, o MedVault se consolida como um modelo de referência para a saúde descentralizada.

## 📄 Licença

Este projeto está licenciado sob a **Licença MIT**.


