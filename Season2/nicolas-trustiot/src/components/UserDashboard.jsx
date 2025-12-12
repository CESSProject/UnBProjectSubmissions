import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import contractData from "../TrustIoT.json";

export default function UserDashboard({ account }) {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadMyDevices = async () => {
    if (!window.ethereum || !account) return;

    try {
      setLoading(true);

      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(
        contractData.address,
        contractData.abi,
        provider
      );

      const list = await contract.getDevicesByOwner(account);

      const finalList = [];
      for (let id of list) {
        const rec = await contract.getRecord(id);
        finalList.push(rec);
      }
      setDevices(finalList);

    } catch (error) {
      console.error("Erro ao carregar dispositivos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMyDevices();
  }, [account]);

  return (
    <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 mt-8">
      <h2 className="text-2xl font-bold text-teal-300">📱 Meus Dispositivos</h2>

      {loading && (
        <p className="text-slate-400 mt-4">Carregando...</p>
      )}

      {!loading && devices.length === 0 && (
        <p className="mt-4 text-slate-500">Nenhum dispositivo registrado ainda.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {devices.map((d, i) => (
          <div
            key={i}
            className="bg-slate-800 border border-slate-700 p-4 rounded-lg shadow"
          >
            <h3 className="text-teal-400 font-semibold break-words">{d.deviceId}</h3>
            <p className="text-slate-400 text-sm break-words mt-2">
              <strong>Hash:</strong> {d.hashData}
            </p>
            <p className="text-slate-500 text-xs mt-2">
              <strong>Registrado em:</strong>{" "}
              {new Date(Number(d.timestamp) * 1000).toLocaleString()}
            </p>
            <p className="text-purple-400 text-xs mt-1">
              <strong>Dono:</strong> {d.owner}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

