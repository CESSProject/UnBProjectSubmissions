# <<img src="public/logo_cortada.png" height="100" />

# **TrustIOT — Decentralized Network Security**

**TrustIOT is a blockchain-powered framework that brings trust, auditability, and cryptographic verification to IoT networks.**
It ensures device authenticity, secure telemetry validation, and decentralized access control with transparency and zero-trust guarantees.

---

<p align="center">
  <img src="https://img.shields.io/badge/Status-Active-00c853?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/Blockchain-Ethereum%2FSepolia-3C3C3D?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/IoT-Device%20Integrity-18ffff?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/API-REST%20%2F%20Web3-2962ff?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/Frontend-React%2BVite-42a5f5?style=for-the-badge"/>
</p>

---

# 📌 **Overview**

TrustIOT provides:

* 🔐 **Decentralized Identity (DID)** for IoT devices
* 🧾 **Tamper-proof telemetry logs stored on-chain**
* 🔍 **Real-time verification of device events**
* 🛡️ **Attack prevention via reputation + trust-scoring**
* ⚡ Lightweight SDK for microcontrollers
* 🌐 Dashboard for monitoring contracts, devices, and events

---

# 🧩 **High-Level Architecture**

```
           ┌───────────────────────────┐
           │        IoT Device         │
           │  Sensors • Firmware • SDK │
           └──────────────┬────────────┘
                          │ Telemetry + Signed Events
                          ▼
                ┌─────────────────────┐
                │  TrustIOT Backend   │
                │  (Node.js + Web3)   │
                └────────────┬────────┘
                             │ Transaction Build & Validation
                             ▼
                ┌─────────────────────────┐
                │  Ethereum Network       │
                │ (Sepolia / Mainnet)     │
                └────────────┬────────────┘
                             │ Event Logs / State Changes
                             ▼
                ┌─────────────────────────┐
                │ TrustIOT Dashboard      │
                │ (React + Vite + Web3)   │
                └─────────────────────────┘
```

---

# 🛡️ **Core Features**

### ✔ Decentralized Device Registry

Every device is minted as an on-chain entity with signature validation.

### ✔ Secure Telemetry Verification

Events are hashed → verified → stored immutably.

### ✔ Role-Based Access

Admins, Operators, Auditors → each mapped to blockchain permissions.

### ✔ Attack Detection

Suspicious patterns generate blockchain alerts & dashboard warnings.

---

# 🏗️ **Project Structure**

```
trustiot/
 ├── backend/            # Node.js API + Web3 services
 ├── contracts/          # Solidity smart contracts
 ├── dashboard/          # React (Vite) frontend
 ├── sdk/                # Lightweight IoT firmware SDK
 └── README.md
```

---

# 🔧 **Installation**

## 1. Clone the repository

```bash
git clone https://github.com/your-org/TrustIOT.git
cd TrustIOT
```

## 2. Install dependencies

### Backend

```bash
cd backend
npm install
```

### Dashboard

```bash
cd dashboard
npm install
```

---

# 🔐 **Environment Variables**

Create a file named **`TrustIoT.env`** inside the backend folder:

```
PRIVATE_KEY=YOUR_WALLET_PRIVATE_KEY
RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
CONTRACT_ADDRESS=0x....
```

### Where do I get the private key?

Use a **test wallet**, such as:

* MetaMask (Account → Details → Export Private Key)
* Rainbow Wallet (Settings → Developer → Export Key)

⚠ Do NOT use your main Ethereum wallet.

---

# ⚙️ **Run the project**

### Backend

```bash
npm run dev
```

### Dashboard

```bash
npm run dev
```

---

# 📡 **Smart Contract Flow (Diagram)**

```
           Device
            │
            │ 1. Sends data
            ▼
     TrustIOT Backend
            │
            │ 2. Validates + hashes payload
            ▼
     Solidity Contract
            │
            │ 3. Emits event + stores hash
            ▼
      TrustIOT Dashboard
```

---

# 🧪 **Testing**

### Contract tests (Hardhat)

```bash
npm test
```

---

# 📈 **Dashboard Preview (Insert Your Graphs)**

Replace with your IoTGraph.jsx output later:

```
+-----------------------------------------+
|       Device Telemetry Over Time        |
|   • Real-time blockchain-verified        |
|   • Color-adaptive line chart            |
+-----------------------------------------+
```

---

# 🔮 **Roadmap**

* [ ] Autonomous threat detection engine
* [ ] zk-Proof for anonymized telemetry
* [ ] Multi-chain support (Base, Linea, Polygon)
* [ ] Mobile app (Flutter)

---

# 🤝 **Contributing**

Pull requests are welcome.
Please open an issue before starting major changes.

---

# 📄 **License**

MIT License © 2025 TrustIOT
