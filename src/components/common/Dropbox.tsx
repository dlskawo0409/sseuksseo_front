import React from "react";
import FormLabel from "@/components/common/FormLabel";

type Option<T extends string | number> = {
  value: T;
  label: string;
  disabled?: boolean;
};

type DropboxProps<T extends string | number> = {
  label?: string;
  required?: boolean;
  input: Option<T>[];
  value: T | "";
  setValue: React.Dispatch<React.SetStateAction<T | "">>;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  name?: string;
  id?: string;
};

export default function Dropbox<T extends string | number>({
  label = "",
  required = false,
  input,
  value,
  setValue,
  disabled = false,
  placeholder = "선택하세요",
  className = "",
  name,
  id,
}: DropboxProps<T>) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && <FormLabel label={label} required={required} />}

      {/* relative: 아이콘 위치 기준 */}
      <div className="relative">
        <select
          id={id}
          name={name}
          disabled={disabled}
          value={value as any}
          onChange={(e) => setValue(e.target.value as unknown as T)}
          className={`w-full appearance-none rounded-2xl border bg-white px-4 py-3 pr-10 text-sm outline-none transition
            border-gray-300 focus:ring-2 focus:ring-brand-accent/50
            disabled:opacity-50 disabled:cursor-not-allowed`}
          aria-disabled={disabled}
        >
          {value === "" && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {input.map((opt) => (
            <option key={String(opt.value)} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* ▼ CSS 보더 삼각형 아이콘 */}
        <span
          aria-hidden
          className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2
            w-0 h-0 
            border-l-[6px] border-r-[6px] border-t-[7px]
            border-l-transparent border-r-transparent
            ${disabled ? "border-t-gray-300 opacity-60" : "border-t-gray-500"}`}
        />
      </div>
    </div>
  );
}
