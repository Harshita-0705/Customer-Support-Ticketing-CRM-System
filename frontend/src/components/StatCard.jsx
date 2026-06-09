import React from "react";

export default function StatCard({ label, value, sub, color = "text-brand", icon }) {
  return (
    <div className="card p-5 flex items-start gap-4 animate-slideUp">
      {icon && (
        <div className="w-10 h-10 rounded-xl bg-surface-2 border border-[#2a3045] flex items-center justify-center text-xl flex-shrink-0">
          {icon}
        </div>
      )}
      <div className="min-w-0">
        <p className="text-xs font-semibold text-[#7a8299] uppercase tracking-wide mb-1">
          {label}
        </p>
        <p className={`text-3xl font-semibold font-mono ${color}`}>{value}</p>
        {sub && <p className="text-xs text-[#7a8299] mt-1">{sub}</p>}
      </div>
    </div>
  );
}
