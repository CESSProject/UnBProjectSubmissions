// sim-iot.js
import { ethers } from "ethers";
import crypto from "crypto";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

const RPC_URL = process.env.RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const TRUSTIOT_JSON_PATH = process.env.TRUSTIOT_JSON_PATH || "../src/TrustIoT.json";
const INTERVAL_MS = parseInt(process.env.INTERVAL_MS || "10000", 10);
const NUM_DEVICES = parseInt(process.env.NUM_DEVICES || "1", 10);

if (!RPC_URL || !PRIVATE_KEY) {
  console.error("❌ Defina RPC_URL e PRIVATE_KEY no .env");
  process.exit(1);
}

// carrega JSON do contrato
const jsonPath = path.resolve(process.cwd(), TRUSTIOT_JSON_PATH);
if (!fs.existsSync(jsonPath)) {
  console.error("❌ TrustIoT.json não encontrado em:", jsonPath);
  process.exit(1);
}
const TrustIoT = JSON.parse(fs.readFileSync(jsonPath, "utf8"));

const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const contract = new ethers.Contract(TrustIoT.address, TrustIoT.abi, wallet);

console.log("Simulador IoT iniciado");
console.log("Conta:", wallet.address);
console.log("Contrato:", TrustIoT.address);
console.log(`Simulando ${NUM_DEVICES} dispositivos, intervalo ${INTERVAL_MS} ms\n`);

// --- helpers ---
function randFloat(min, max, decimals = 2) {
  const v = Math.random() * (max - min) + min;
  return Number(v.toFixed(decimals));
}

function sensorPayload(deviceId) {
  return {
    deviceId,
    temperature: randFloat(15, 35, 2), // °C
    humidity: randFloat(20, 90, 1),    // %
    battery: randFloat(20, 100, 1),    // %
    ts: Date.now()
  };
}

function sha256Hex(str) {
  return crypto.createHash("sha256").update(str).digest("hex");
}

// gera device ids (pode usar MAC-like ou UUID)
function genDeviceId(i) {
  // exemplo: fd00:sim:<i>
  const hex = (1000 + i).toString(16);
  return `fd00:sim:${hex}::1`;
}

// envia um único registro para o contrato
async function sendReading(deviceId) {
  try {
    const payload = sensorPayload(deviceId);
    const payloadJson = JSON.stringify(payload);
    const hash = sha256Hex(payloadJson); // string hex sem 0x

    console.log(`[${new Date().toLocaleTimeString()}] Device ${deviceId} -> payload:`, payload);
    console.log("Hash:", hash);

    // contract.registerDevice espera strings deviceId, hashData
    const tx = await contract.registerDevice(deviceId, hash);
    console.log("Tx enviada:", tx.hash);

    const receipt = await tx.wait();
    console.log("Tx confirmada:", receipt.transactionHash, "block", receipt.blockNumber);
  } catch (err) {
    console.error("Erro ao enviar leitura:", err);
  }
}

// função que inicia o loop para um device
function startDeviceLoop(deviceId, intervalMs) {
  // enviar imediatamente e depois a cada interval
  sendReading(deviceId);
  const timer = setInterval(() => sendReading(deviceId), intervalMs);
  return timer;
}

// inicia N dispositivos
const timers = [];
for (let i = 0; i < NUM_DEVICES; i++) {
  const deviceId = genDeviceId(i);
  timers.push(startDeviceLoop(deviceId, INTERVAL_MS));
}

// captura SIGINT pra limpar timers e sair suave
process.on("SIGINT", () => {
  console.log("\nParando simulador...");
  timers.forEach((t) => clearInterval(t));
  process.exit(0);
});

