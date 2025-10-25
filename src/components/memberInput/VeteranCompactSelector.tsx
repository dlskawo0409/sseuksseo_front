import React, { useEffect, useMemo } from "react";
import clsx from "clsx";
import FormLabel from "@/components/common/FormLabel";

export type VeteranEligibility = "ELIGIBLE" | "INELIGIBLE" | "";

export interface VeteranCompactValue {
  eligibility: VeteranEligibility; // 대상/비대상
  veteranNo: string; // 보훈번호 (대상일 때 필수)
  ratio: 0 | 5 | 10; // 보훈비율
}

interface VeteranCompactSelectorProps {
  value: VeteranCompactValue;
  setValue: React.Dispatch<React.SetStateAction<VeteranCompactValue>>;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  onValidChange?: (valid: boolean) => void;
}

export default function VeteranCompactSelector({
  value,
  setValue,
  label = "보훈 정보",
  required = false,
  disabled = false,
  className = "",
  onValidChange,
}: VeteranCompactSelectorProps) {
  const { eligibility, veteranNo, ratio } = value;

  const update = <K extends keyof VeteranCompactValue>(k: K, v: VeteranCompactValue[K]) =>
    setValue((prev) => ({ ...prev, [k]: v }));

  // 대상/비대상 눌렀을 때 동작
  const setEligibility = (next: VeteranEligibility) => {
    if (next === "INELIGIBLE") {
      // 비대상 → 비율 0% 고정, 번호/관계 초기화
      setValue({ eligibility: "INELIGIBLE", veteranNo: "", ratio: 0 });
    } else if (next === "ELIGIBLE") {
      // 대상 → 기본 비율 5%로 시작(원하면 0으로 바꿔도 됨)
      setValue((prev) => ({
        eligibility: "ELIGIBLE",
        veteranNo: prev.veteranNo ?? "",
        ratio: (prev.ratio ?? 5) as 0 | 5 | 10,
      }));
    } else {
      setValue({ eligibility: "", veteranNo: "", ratio: 0 });
    }
  };

  // 유효성 규칙
  const isValid = useMemo(() => {
    if (!required) {
      // 선택사항일 때는 대상이면 필드 체크, 아니면 자유
      if (eligibility === "ELIGIBLE") {
        return veteranNo.trim().length > 0;
      }
      return true;
    }
    // 필수일 때
    if (eligibility === "") return false;
    if (eligibility === "ELIGIBLE") {
      if (!veteranNo.trim()) return false;
      if (![0, 5, 10].includes(ratio)) return false;
    } else {
      // INELIGIBLE이면 ratio는 0이어야 함
      if (ratio !== 0) return false;
    }
    return true;
  }, [required, eligibility, veteranNo, ratio]);

  useEffect(() => {
    onValidChange?.(isValid);
  }, [isValid, onValidChange]);

  const ratioOptions: Array<0 | 5 | 10> = [0, 5, 10];

  return (
    <div className={clsx("flex flex-col gap-3", className)}>
      <FormLabel label={label} required={required} />

      {/* 1) 대상/비대상 버튼형 라디오 */}
      <div className="flex items-center gap-3">
        {[
          { key: "ELIGIBLE" as const, text: "보훈 대상" },
          { key: "INELIGIBLE" as const, text: "보훈 비대상" },
        ].map((opt) => {
          const selected = eligibility === opt.key;
          return (
            <button
              key={opt.key}
              type="button"
              disabled={disabled}
              onClick={() => setEligibility(opt.key)}
              className={clsx(
                "w-28 py-2 rounded-md border font-medium transition-all duration-200",
                selected
                  ? "bg-brand-navy text-white border-brand-navy"
                  : "bg-white text-brand-navy border-gray-300 hover:bg-brand-paper",
                disabled && "opacity-50 cursor-not-allowed"
              )}
            >
              {opt.text}
            </button>
          );
        })}
      </div>

      {/* 3) 대상일 때만 번호/관계 입력 */}
      {eligibility === "ELIGIBLE" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 border rounded-md p-4 bg-gray-50">
          {/* 보훈번호 + 비율 */}
          <div>
            <FormLabel label="보훈번호 / 비율" required />
            <div className="flex gap-2">
              {/* 보훈번호 입력 */}
              <input
                type="text"
                value={veteranNo}
                onChange={(e) => update("veteranNo", e.target.value)}
                disabled={disabled}
                placeholder="예: V-2024-000123"
                className="flex-1 rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-brand-navy/20 focus:border-brand-navy"
              />

              {/* 비율 선택 */}
              <div className="flex-shrink-0 flex gap-1">
                {[0, 5, 10].map((r) => {
                  const active = ratio === r;
                  return (
                    <button
                      key={r}
                      type="button"
                      disabled={disabled}
                      onClick={() => update("ratio", r as 0 | 5 | 10)}
                      className={clsx(
                        "w-12 h-[42px] flex items-center justify-center rounded-md border text-sm font-medium transition-all duration-200",
                        active
                          ? "bg-brand-navy text-white border-brand-navy"
                          : "bg-white text-brand-navy border-gray-300 hover:bg-brand-paper",
                        disabled && "opacity-50 cursor-not-allowed"
                      )}
                    >
                      {r}%
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 유효성 안내 */}
          {!isValid && (
            <p className="md:col-span-2 text-xs text-red-500">
              보훈번호, 관계, 보훈비율을 모두 입력해 주세요.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
