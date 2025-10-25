import React from "react";

interface DividerProps {
  text?: string;
  className?: string;
}

export default function Divider({ text = "", className = "" }: DividerProps) {
  return (
    <div
      className={`relative flex items-center justify-center text-gray-500 text-sm opacity-70 ${className}`}
    >
      {/* 좌측 선 */}
      <div className="flex-grow h-px bg-gradient-to-r from-transparent via-gray-400 to-transparent" />

      {/* 텍스트 */}
      {text && <span className="px-3 text-gray-500">{text}</span>}

      {/* 우측 선 */}
      <div className="flex-grow h-px bg-gradient-to-r from-transparent via-gray-400 to-transparent" />
    </div>
  );
}
