import React from "react";

const configs = {
  "Open": {
    cls: "bg-green-500/10 text-green-400 border border-green-500/20",
    dot: "bg-green-400",
  },
  "In Progress": {
    cls: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
    dot: "bg-amber-400",
  },
  "Closed": {
    cls: "bg-gray-500/20 text-gray-400 border border-gray-500/30",
    dot: "bg-gray-400",
  },
};

export default function StatusBadge({ status, size = "sm" }) {
  const cfg = configs[status] || configs["Open"];
  const textSize = size === "md" ? "text-sm px-3 py-1.5" : "text-xs px-2.5 py-1";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${textSize} ${cfg.cls}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {status}
    </span>
  );
}
