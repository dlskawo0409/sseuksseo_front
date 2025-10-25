import React, { useEffect, useMemo } from "react";
import clsx from "clsx";
import FormLabel from "@/components/common/FormLabel";

export type DisabilityLevel = "심한 장애인" | "심하지 않은 장애인" | "";

export interface DisabilityValue {
  hasDisability: boolean | null; // true=있음, false=없음, null=미선택
  type?: string;
  level?: DisabilityLevel;
}

interface DisabilitySelectorProps {
  value: DisabilityValue;
  setValue: React.Dispatch<React.SetStateAction<DisabilityValue>>;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  onValidChange?: (valid: boolean) => void;

  /** (선택) 외부에서 유형/정도를 별도 상태로 관리하고 싶을 때 사용 */
  disabilityType?: string;
  setDisabilityType?: React.Dispatch<React.SetStateAction<string>>;
  disabilityLevel?: DisabilityLevel;
  setDisabilityLevel?: React.Dispatch<React.SetStateAction<DisabilityLevel>>;
}

export default function DisabilitySelector({
  value,
  setValue,
  label = "장애 여부",
  required = false,
  disabled = false,
  className = "",
  onValidChange,

  // 외부 상태가 주어지면 우선 사용(옵션)
  disabilityType,
  setDisabilityType,
  disabilityLevel,
  setDisabilityLevel,
}: DisabilitySelectorProps) {
  const { hasDisability, type = "", level = "" } = value;

  // 외부 상태가 있으면 그 값을 우선 사용, 없으면 value의 값을 사용
  const typeValue = disabilityType ?? type;
  const levelValue = (disabilityLevel ?? level) as DisabilityLevel;

  // ✅ 유효성 검사
  const isValid = useMemo(() => {
    if (required && hasDisability === null) return false;
    if (hasDisability === true && (!typeValue || !levelValue)) return false;
    return true;
  }, [required, hasDisability, typeValue, levelValue]);

  useEffect(() => {
    onValidChange?.(isValid);
  }, [isValid, onValidChange]);

  // 공용 업데이트 헬퍼: value와(필요시) 외부 상태 동시 업데이트
  const updateValue = <K extends keyof DisabilityValue>(k: K, v: DisabilityValue[K]) => {
    setValue((prev) => ({ ...prev, [k]: v }));
  };

  const updateType = (next: string) => {
    updateValue("type", next);
    setDisabilityType?.(next);
  };

  const updateLevel = (next: DisabilityLevel) => {
    updateValue("level", next);
    setDisabilityLevel?.(next);
  };

  const resetDetails = () => {
    setValue({
      hasDisability: false,
      type: "",
      level: "",
    });
    setDisabilityType?.("");
    setDisabilityLevel?.("");
  };

  return (
    <div className={clsx("flex flex-col gap-3", className)}>
      <FormLabel label={label} required={required} />

      {/* 버튼형 라디오 */}
      <div className="flex gap-3">
        {[
          { label: "있음", value: true },
          { label: "없음", value: false },
        ].map((opt) => {
          const isSelected = hasDisability === opt.value;
          return (
            <button
              key={String(opt.value)}
              type="button"
              disabled={disabled}
              onClick={() => {
                if (opt.value === false) resetDetails();
                else updateValue("hasDisability", true);
              }}
              className={clsx(
                "w-24 py-2 rounded-md border font-medium transition-all duration-200",
                isSelected
                  ? "bg-brand-navy text-white border-brand-navy"
                  : "bg-white text-brand-navy border-gray-300 hover:bg-brand-paper",
                disabled && "opacity-50 cursor-not-allowed"
              )}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      {/* 세부 항목 */}
      {hasDisability === true && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 border rounded-md p-4 mt-2 bg-gray-50 animate-fade-in">
          {/* 장애 유형 */}
          <div>
            <FormLabel label="장애 유형" required />
            <select
              value={typeValue}
              onChange={(e) => updateType(e.target.value)}
              disabled={disabled}
              className="w-full border border-gray-300 rounded-md p-2 bg-white focus:border-brand-navy focus:ring-2 focus:ring-brand-navy/20"
            >
              <option value="">선택하세요</option>
              {[
                "간장애",
                "뇌전증장애(간질장애)",
                "뇌병변장애",
                "시각장애",
                "신장장애",
                "심장장애",
                "안면변형장애",
                "장루/요루장애",
                "정신장애",
                "청각장애",
                "호흡기장애",
                "지체장애",
                "언어장애",
                "지적장애(정신지체)",
                "자폐성장애(발달장애)",
                "기타장애",
              ].map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* 장애 정도 */}
          <div>
            <FormLabel label="장애 정도" required />
            <div className="flex gap-3">
              {(["심한 장애인", "심하지 않은 장애인"] as DisabilityLevel[]).map((lv) => (
                <button
                  key={lv}
                  type="button"
                  onClick={() => updateLevel(lv)}
                  disabled={disabled}
                  className={clsx(
                    "flex-1 py-2 border rounded-md font-medium transition-all duration-200",
                    levelValue === lv
                      ? "bg-brand-navy text-white border-brand-navy"
                      : "bg-white text-brand-navy border-gray-300 hover:bg-brand-paper",
                    disabled && "opacity-50 cursor-not-allowed"
                  )}
                >
                  {lv}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {!isValid && required && (
        <p className="text-xs text-red-500">장애 여부를 올바르게 선택해 주세요.</p>
      )}
    </div>
  );
}
