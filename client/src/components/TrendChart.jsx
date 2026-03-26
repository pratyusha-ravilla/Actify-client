// client/src/components/TrendChart.jsx
import React from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts";

export default function TrendChart({ data = [] }) {
  // expects data: [{month, fdp, talks, attended, total}, ...]
  return (
    <div style={{ width: "100%", height: 260 }}>
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ top: 6, right: 10, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="colorFdp" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.8}/>
              <stop offset="100%" stopColor="#7c3aed" stopOpacity={0.12}/>
            </linearGradient>
            <linearGradient id="colorTalks" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#c084fc" stopOpacity={0.7}/>
              <stop offset="100%" stopColor="#c084fc" stopOpacity={0.08}/>
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Area type="monotone" dataKey="fdp" stackId="1" stroke="#7c3aed" fill="url(#colorFdp)" />
          <Area type="monotone" dataKey="talks" stackId="1" stroke="#c084fc" fill="url(#colorTalks)" />
          <Area type="monotone" dataKey="attended" stackId="1" stroke="#34d399" fill="#e6f7ef" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
