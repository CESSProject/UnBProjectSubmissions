import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import { motion } from "framer-motion";

export default function Dashboard({ records = [], transactions = [] }) {
  // Cores para o gráfico de pizza
  const COLORS = ["#14b8a6", "#0ea5e9", "#f97316", "#e11d48", "#84cc16"];

  // Total de dispositivos distintos
  const uniqueDevices = [...new Set(records.map(r => r.deviceId))];
  const totalDevices = uniqueDevices.length;
  const totalTransactions = transactions.length;

  // Dados do gráfico de pizza — mostra o número de registros por dispositivo
  const pieData = uniqueDevices.map(id => ({
    name: id || "Desconhecido",
    value: records.filter(r => r.deviceId === id).length,
  }));

  // Dados do gráfico de linha — atividade temporal
  const lineData = records.map((r, i) => ({
    name: r.deviceId || `Dispositivo ${i + 1}`,
    valor: parseInt(r.hashData?.slice(0, 4) || "0", 16) % 100,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-slate-950/60 p-8 rounded-2xl border border-slate-800 mt-10 shadow-xl"
    >
      <h2 className="text-3xl font-bold text-center text-teal-400 mb-8">Painel de Monitoramento IoT</h2>

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 text-center">
          <h3 className="text-slate-400 text-sm">Dispositivos Registrados</h3>
          <p className="text-3xl font-bold text-teal-400">{totalDevices}</p>
        </div>
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 text-center">
          <h3 className="text-slate-400 text-sm">Total de Transações</h3>
          <p className="text-3xl font-bold text-teal-400">{totalTransactions}</p>
        </div>
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 text-center">
          <h3 className="text-slate-400 text-sm">Último Registro</h3>
          <p className="text-lg font-semibold text-white">
            {records[0]?.deviceId ? records[0].deviceId : "—"}
          </p>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Gráfico de pizza */}
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
          <h3 className="text-lg font-semibold mb-4 text-teal-400">Distribuição de Registros</h3>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300} minHeight={300} minWidth={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-slate-500 text-center mt-8">Nenhum dado para exibir.</p>
          )}
        </div>

        {/* Gráfico de linha */}
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
          <h3 className="text-lg font-semibold mb-4 text-teal-400">Histórico de Leituras</h3>
          {lineData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300} minHeight={300} minWidth={300}>
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="valor" stroke="#14b8a6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-slate-500 text-center mt-8">Sem leituras recentes.</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

