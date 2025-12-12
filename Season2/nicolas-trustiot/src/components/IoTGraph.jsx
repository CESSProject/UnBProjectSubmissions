import React from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid
} from "recharts";
import { format } from "date-fns";

export default function IoTGraph({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 mt-8 text-slate-500">
        Nenhum dado disponível ainda.
      </div>
    );
  }

  const chartData = data.map((item, i) => ({
    name: item.deviceId || `Device ${i + 1}`,
    value: parseFloat(item.hashData?.slice(0, 4) || "0", 16) % 100,
    time: item.timestamp
      ? format(new Date(Number(item.timestamp) * 1000), "HH:mm:ss")
      : "—",
  }));

  return (
    <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 mt-8">
      <h3 className="text-xl font-semibold mb-4 text-teal-400">
        Histórico de Leituras IoT
      </h3>

      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="time" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                border: "1px solid #334155",
                color: "#fff",
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#14b8a6"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

