import React, { useState } from "react";
import { ethers } from "ethers";

const CONTRACT_ADDRESS = "0x65c7A90cbAeB49e282425efcD2899D55CfCc4302";

const CONTRACT_ABI = [
  {
    "inputs": [
      { "internalType": "string", "name": "deviceId", "type": "string" },
      { "internalType": "string", "name": "hashData", "type": "string" }
    ],
    "name": "registerDevice",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

export default function RegisterDevice() {
  const [mac, setMac] = useState("");
  const [status, setStatus] = useState("");

  // ======== gera DeviceID a partir do MAC ========
  const generateDeviceId = (macAddr) => {
    return ethers.keccak256(ethers.toUtf8Bytes(macAddr));
  };

  const handleRegister = async () => {
    if (!mac) {
      setStatus("❌ Informe o endereço MAC");
      return;
    }

    try {
      setStatus("🔄 Conectando à carteira...");

      await window.ethereum.request({ method: "eth_requestAccounts" });

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      // Gera DeviceID baseado no MAC
      const deviceId = generateDeviceId(mac);
      const fakeHash = "0x" + deviceId.slice(2, 34); // só para demo

      setStatus("📡 Registrando no blockchain...");

      const tx = await contract.registerDevice(deviceId, fakeHash);
      await tx.wait();

      setStatus(`✅ Dispositivo registrado! DeviceID: ${deviceId}`);
    } catch (err) {
      console.error(err);
      setStatus("❌ Erro ao registrar dispositivo");
    }
  };

  return (
    <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 max-w-md mx-auto">
      <h3 className="text-xl font-semibold text-teal-400 mb-4">
        Registrar Dispositivo
      </h3>

      <label className="text-slate-300">Endereço MAC:</label>
      <input
        className="w-full mt-2 mb-4 p-2 rounded bg-slate-800 border border-slate-700 text-slate-200"
        placeholder="Ex: AA:BB:CC:DD:EE:FF"
        value={mac}
        onChange={(e) => setMac(e.target.value)}
      />

      <button
        onClick={handleRegister}
        className="w-full bg-teal-400 text-slate-900 font-semibold py-2 rounded hover:bg-teal-300 hover:scale-105 transition"
      >
        Registrar
      </button>

      <p className="text-slate-400 mt-4">{status}</p>
    </div>
  );
}

