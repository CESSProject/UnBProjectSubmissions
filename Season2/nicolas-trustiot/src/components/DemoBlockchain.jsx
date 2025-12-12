import React, { useState } from "react";
import IoTGraph from "./IoTGraph";
import TransactionLog from "./TransactionLog";
import Dashboard from "./Dashboard";
import { getBlockchain } from "../blockchain";
import contractData from "../TrustIoT.json";
import UserDashboard from "./UserDashboard";

   // ⬅ usar só isso!

export default function DemoBlockchain() {
  const [account, setAccount] = useState(null);
  const [deviceId, setDeviceId] = useState("");
  const [hashData, setHashData] = useState("");
  const [records, setRecords] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mac, setMac] = useState("");

  // -----------------------------
  // 1. Conectar MetaMask
  // -----------------------------
  const connectWallet = async () => {
    try {
      if (!window.ethereum) return alert("MetaMask não encontrada!");

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      setAccount(accounts[0]);
      alert(`🔗 Conectado: ${accounts[0]}`);

      loadMyDevices(accounts[0]);
    } catch (e) {
      console.error(e);
    }
  };

  // -----------------------------
  // 2. Buscar devices do dono
  // -----------------------------
  const loadMyDevices = async (userAddr = account) => {
    try {
      const contract = await getBlockchain();
      if (!contract || !userAddr) return;

      const devices = await contract.getDevicesByOwner(userAddr);

      const all = [];
      for (let id of devices) {
        const rec = await contract.getRecord(id);
        if (rec.deviceId) all.push(rec);
      }

      setRecords(all);
    } catch (e) {
      console.error("Erro ao carregar dispositivos:", e);
    }
  };

  // -----------------------------
  // 3. Registrar novo dispositivo
  // -----------------------------
  const registerDevice = async () => {
    if (!account) return alert("Conecte sua carteira!");
    if (!deviceId || !hashData) return alert("Preencha os campos!");

    try {
      setLoading(true);
      const contract = await getBlockchain();
      if (!contract) return;

      const tx = await contract.registerDevice(deviceId, hashData);
      await tx.wait();

      setTransactions((prev) => [
        { deviceId, txHash: tx.hash, timestamp: Date.now() },
        ...prev,
      ]);

      alert("🎉 Registrado com sucesso!");
      loadMyDevices();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // 4. Consulta manual
  // -----------------------------
  const getRecord = async () => {
    try {
      setLoading(true);
      const contract = await getBlockchain();
      if (!contract) return;

      const rec = await contract.getRecord(deviceId);

      if (rec && rec.deviceId) {
        setRecords((prev) => [rec, ...prev]);
      } else {
        alert("Nenhum registro encontrado.");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // 5. MAC → DeviceID
  // -----------------------------
  const generateDeviceId = () => {
    if (!mac || mac.length < 17)
      return alert("MAC inválido! Use AA:BB:CC:DD:EE:FF");

    const clean = mac.replace(/:/g, "").toLowerCase();
    const ipv6 = `fd00:${clean.slice(0, 4)}:${clean.slice(4, 8)}:${clean.slice(8, 12)}::1`;

    setDeviceId(ipv6);
    alert("DeviceID gerado!");
  };

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <div className="max-w-4xl mx-auto p-6 bg-slate-950/50 rounded-xl border border-slate-800">

      {!account ? (
        <button onClick={connectWallet}
          className="bg-teal-400 px-6 py-3 rounded-lg text-black font-bold">
          Conectar MetaMask
        </button>
      ) : (
        <>
          <p className="text-slate-300 mb-4">Conectado: {account}</p>

          <button
            onClick={() => loadMyDevices()}
            className="bg-purple-500 text-white px-4 py-2 rounded-lg mb-4">
            🔄 Atualizar dispositivos
          </button>

          {/* Inputs */}
          <div className="flex flex-col md:flex-row gap-4">
            <input
              value={deviceId}
              onChange={(e) => setDeviceId(e.target.value)}
              placeholder="DeviceID"
              className="p-3 bg-slate-800 text-white rounded-md border border-slate-700 flex-1"
            />
            <input
              value={hashData}
              onChange={(e) => setHashData(e.target.value)}
              placeholder="Hash"
              className="p-3 bg-slate-800 text-white rounded-md border border-slate-700 flex-1"
            />
          </div>

          {/* MAC → DeviceID */}
          <div className="mt-6 bg-slate-900 p-4 rounded-lg border border-slate-700">
            <h3 className="text-teal-300 font-bold mb-2">Gerar DeviceID (MAC → IPv6)</h3>

            <div className="flex flex-col md:flex-row gap-4">
              <input
                value={mac}
                onChange={(e) => setMac(e.target.value)}
                placeholder="AA:BB:CC:DD:EE:FF"
                className="p-3 bg-slate-800 text-white border border-slate-700 rounded-md flex-1"
              />
              <button
                onClick={generateDeviceId}
                className="bg-purple-500 text-white px-6 py-3 rounded-lg">
                Gerar
              </button>
            </div>
          </div>

          {/* Botões */}
          <div className="mt-6 flex gap-4 justify-center">
            <button onClick={registerDevice}
              className="bg-teal-400 px-6 py-3 rounded-lg text-black font-bold">
              Registrar
            </button>
            <button onClick={getRecord}
              className="bg-slate-700 px-6 py-3 rounded-lg text-white">
              Consultar
            </button>
          </div>

          <IoTGraph data={records} />
          <TransactionLog transactions={transactions} />
          <Dashboard records={records} />
          <UserDashboard account={account} />
        </>
      )}
    </div>
  );
}

