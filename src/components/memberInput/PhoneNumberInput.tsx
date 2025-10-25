import { useEffect, useMemo, useRef, useState } from "react";
import clsx from "clsx";
import FormLabel from "@/components/common/FormLabel";

type StoreMode = "digits" | "formatted";

type PhoneInputProps = {
  /** 외부 상태 */
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  /** 라벨/필수/비활성화/스타일 */
  label?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
  /** 저장 모드: digits(숫자만) | formatted(하이픈 포함). 기본 digits */
  storeMode?: StoreMode;
  /** 유효 상태가 바뀔 때 알림 */
  onValidChange?: (valid: boolean) => void;
  /** 에러 메시지를 외부에서 처리하고 싶을 때 */
  onError?: (msg: string) => void;
  /** 최대 자리수 강제 (기본 11 — 한국 휴대폰) */
  maxDigits?: number;
};

function onlyDigits(s: string) {
  return s.replace(/\D+/g, "");
}

/** 한국 휴대폰 포맷팅: 010은 3-4-4, 그 외 01X는 3-3/4-4 */
function formatKoreanMobile(digits: string) {
  const d = digits.slice(0, 11); // 11자리 제한
  if (d.startsWith("010")) {
    if (d.length <= 3) return d;
    if (d.length <= 7) return `${d.slice(0, 3)}-${d.slice(3)}`;
    return `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7)}`;
  }
  // 011/016/017/018/019 등 (10~11자리)
  if (/^01[1-9]/.test(d)) {
    if (d.length <= 3) return d;
    if (d.length <= 6) return `${d.slice(0, 3)}-${d.slice(3)}`;
    if (d.length === 10) {
      // 3-3-4
      return `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}`;
    }
    // 11자리면 3-4-4
    if (d.length >= 7) return `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7)}`;
  }
  // 기본 fallback
  return d;
}

/** 한국 휴대폰 유효성 검사: 010은 11자리, 그 외 01X는 10~11자리 허용 */
function isValidKoreanMobile(digits: string) {
  if (/^010\d{8}$/.test(digits)) return true; // 010-XXXX-XXXX (11)
  if (/^01[1-9]\d{7,8}$/.test(digits)) return true; // 011/016/017/018/019 (10~11)
  return false;
}

export default function PhoneNumberInput({
  value,
  setValue,
  label = "휴대폰 번호",
  required = true,
  disabled = false,
  className = "",
  placeholder = "010-1234-5678",
  storeMode = "digits",
  onValidChange,
  onError,
  maxDigits = 11,
}: PhoneInputProps) {
  const [digits, setDigits] = useState<string>(() => onlyDigits(value));
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState("");

  // 외부 value가 변경될 때 동기화(드물지만 대비)
  useEffect(() => {
    const d = onlyDigits(value);
    if (d !== digits) setDigits(d);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const formatted = useMemo(() => formatKoreanMobile(digits), [digits]);

  // 외부에 저장 (digits | formatted)
  useEffect(() => {
    const out = storeMode === "digits" ? digits : formatted;
    if (out !== value) setValue(out);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [digits, formatted, storeMode]);

  // 유효성 상태 통지
  useEffect(() => {
    const valid = !required && digits.length === 0 ? true : isValidKoreanMobile(digits);
    onValidChange?.(valid);
  }, [digits, required, onValidChange]);

  const validate = (d: string) => {
    if (required && d.length === 0) {
      setError("휴대폰 번호를 입력해 주세요.");
      onError?.("휴대폰 번호를 입력해 주세요.");
      return false;
    }
    if (d.length > 0 && !isValidKoreanMobile(d)) {
      setError("휴대폰 번호 형식을 확인해 주세요. 예) 010-1234-5678");
      onError?.("휴대폰 번호 형식을 확인해 주세요.");
      return false;
    }
    setError("");
    return true;
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextDigits = onlyDigits(e.target.value).slice(0, maxDigits);
    setDigits(nextDigits);
    if (touched) validate(nextDigits);
  };

  const onBlur = () => {
    setTouched(true);
    validate(digits);
  };

  return (
    <div className={clsx("flex flex-col gap-2", className)}>
      <FormLabel label={label} required={required} />
      <input
        type="tel"
        inputMode="numeric"
        autoComplete="tel"
        placeholder={placeholder}
        disabled={disabled}
        value={formatted}
        onChange={onChange}
        onBlur={onBlur}
        aria-invalid={!!error}
        aria-describedby={error ? "phone-error" : undefined}
        className={clsx(
          "w-full rounded-md border p-2 outline-none transition",
          error
            ? "border-red-500 focus:ring-2 focus:ring-red-200"
            : "border-gray-300 focus:border-brand-navy focus:ring-2 focus:ring-brand-navy/20",
          disabled && "opacity-60 cursor-not-allowed"
        )}
      />
      {error ? (
        <p id="phone-error" className="text-xs text-red-500">
          {error}
        </p>
      ) : (
        <p className="text-xs text-gray-500">
          숫자만 입력해도 자동으로 010-1234-5678 형식이 됩니다.
        </p>
      )}
    </div>
  );
}
