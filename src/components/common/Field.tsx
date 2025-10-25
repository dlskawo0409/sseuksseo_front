import React from "react";

interface FieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  type?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  error?: string;
  hint?: string;
}

export default function Field({
  label,
  value,
  onChange,
  placeholder,
  required,
  disabled = false,
  type = "text",
  inputMode,
  error,
  hint,
}: FieldProps) {
  const errorId = `${label}-error`;

  return (
    <div className="flex flex-col gap-2">
      {/* Label */}
      <label className="text-sm font-semibold text-brand-deep">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      {/* Input */}
      <input
        type={type}
        inputMode={inputMode}
        className={`w-full rounded-2xl border bg-white px-4 py-3 outline-none transition 
          focus:ring-2 focus:ring-brand-accent/50 
          ${error ? "border-red-300" : "border-gray-200"}`}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
      />

      {/* Hint / Error */}
      {hint && !error && <p className="text-xs text-brand-gray">{hint}</p>}
      {error && (
        <p id={errorId} className="text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
