import React from "react";

const configs = {
  "Urgent": "bg-red-500/10 text-red-400 border border-red-500/20",
  "High":   "bg-orange-500/10 text-orange-400 border border-orange-500/20",
  "Normal": "bg-blue-500/10 text-blue-400 border border-blue-500/20",
};

export default function PriorityBadge({ priority }) {
  const cls = configs[priority] || configs["Normal"];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${cls}`}>
      {priority}
    </span>
  );
}
