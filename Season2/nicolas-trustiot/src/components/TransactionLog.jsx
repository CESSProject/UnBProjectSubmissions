import React from "react";
import { format } from "date-fns";

export default function TransactionLog({ transactions }) {
  if (!transactions.length)
    return <p className="text-slate-500 mt-4">Nenhuma transação registrada ainda.</p>;

  return (
    <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 mt-8">
      <h3 className="text-xl font-semibold mb-4 text-teal-400">Transações Recentes</h3>
      <ul className="space-y-3">
        {transactions.map((tx, idx) => (
          <li key={idx} className="bg-slate-800/60 p-3 rounded-lg text-left text-slate-300">
            <p><strong>Device:</strong> {tx.deviceId}</p>
            <p><strong>Tx:</strong> <a href={`https://sepolia.etherscan.io/tx/${tx.txHash}`} target="_blank" rel="noreferrer" className="text-teal-400 hover:underline">{tx.txHash.slice(0, 20)}...</a></p>
            <p><strong>Data:</strong> {format(new Date(tx.timestamp * 1000), "dd/MM/yyyy HH:mm:ss")}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
