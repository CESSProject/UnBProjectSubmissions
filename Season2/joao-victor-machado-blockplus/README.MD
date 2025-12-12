# CESS Project

## 🚀 Setup

1. **Backend:**
```bash
cd backend
npm install
```
Edit `.env`:
```env
JWT_SECRET="your_jwt_secret_key"
TERRITORY="your_territory_name"
ACCOUNT="your_wallet"
SIGNATURE="your_signature"
MESSAGE="your_territory_name"
CESS_API_URL="deoss_gateway_addr"
```

2. **Frontend:**
```bash
cd frontend
npm install
```

## ▶️ Run

**Backend (always port 5003):**
```bash
cd backend
npm run dev
```

**Frontend (random port):**
```bash
cd frontend
npm run dev
```
Check console for frontend URL.

## 🌐 Use

1. Open frontend URL from console
2. Register with Polkadot{.js} extension
3. Everything works automatically after login

## 📝 Notes
- Backend: `localhost:5003`
- Frontend: `localhost:[RANDOM_PORT]`
- Polkadot wallet required
- Edit `.env` before starting backend