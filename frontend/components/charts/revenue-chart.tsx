"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import type { RevenuePoint } from "@/services/analytics";

interface RevenueChartProps {
  data: RevenuePoint[];
}

export function RevenueChart({ data }: RevenueChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-slate-400">
        No revenue data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 12, fill: "#64748b" }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          tick={{ fontSize: 12, fill: "#64748b" }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => `$${v}`}
        />
        <Tooltip
          contentStyle={{
            background: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            fontSize: "13px",
          }}
          formatter={(value) => [`$${Number(value).toLocaleString()}`, "Revenue"]}
        />
        <Line
          type="monotone"
          dataKey="revenue"
          stroke="#6366f1"
          strokeWidth={2}
          dot={{ fill: "#6366f1", r: 3 }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
