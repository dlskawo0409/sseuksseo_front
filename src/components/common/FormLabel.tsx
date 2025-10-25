import React from "react";

type FormLabelProps = {
  label: string;
  required?: boolean;
  className?: string;
};

export default function FormLabel({ label, required = false, className = "" }: FormLabelProps) {
  return (
    <label
      className={`text-sm text-brand-navy flex items-center gap-1 ${
        required ? "font-bold" : "font-normal"
      } ${className}`}
    >
      {label}
      {required && <span className="text-red-500">*</span>}
    </label>
  );
}
