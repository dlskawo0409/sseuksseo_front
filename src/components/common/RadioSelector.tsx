import React from "react";
import FormLabel from "@/components/common/FormLabel";

interface Option<T> {
  value: T;
  label: string;
}

interface RadioSelectorProps<T> {
  label?: string;
  required?: boolean;
  value: T;
  onChange: (v: T) => void;
  options: Option<T>[];
  disabled?: boolean;
  className?: string;
}

export default function RadioSelector<T extends string | number>({
  label = "",
  required = false,
  value,
  onChange,
  options,
  disabled = false,
  className = "",
}: RadioSelectorProps<T>) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && <FormLabel label={label} required={required} />}

      <div className="flex flex-wrap gap-3">
        {options.map((opt) => {
          const isSelected = value === opt.value;
          return (
            <button
              key={String(opt.value)}
              type="button"
              disabled={disabled}
              onClick={() => onChange(opt.value)}
              className={`flex items-center justify-center min-w-[4rem] px-4 py-2 border rounded-lg text-sm font-medium transition-all duration-200
                ${
                  isSelected
                    ? "bg-brand-navy text-white border-brand-navy"
                    : "bg-white text-brand-navy border-gray-300 hover:bg-brand-paper"
                }
                ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
              `}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
