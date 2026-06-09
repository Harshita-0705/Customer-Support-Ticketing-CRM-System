import React from "react";

export default function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      {icon && (
        <div className="w-16 h-16 rounded-2xl bg-[#1e2333] border border-[#2a3045] flex items-center justify-center mb-4 text-[#7a8299] text-3xl">
          {icon}
        </div>
      )}
      <p className="text-base font-medium text-gray-300 mb-1">{title}</p>
      {description && (
        <p className="text-sm text-[#7a8299] max-w-xs mb-4">{description}</p>
      )}
      {action && action}
    </div>
  );
}
