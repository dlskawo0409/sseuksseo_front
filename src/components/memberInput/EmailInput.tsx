import { useEffect, useMemo, useRef, useState } from "react";
import FormLabel from "@/components/common/FormLabel";
import clsx from "clsx";

type EmailSplitInputProps = {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  /** 도메인 옵션 */
  domains?: string[];
};

const DEFAULT_DOMAINS = [
  "gmail.com",
  "naver.com",
  "daum.net",
  "hanmail.net",
  "kakao.com",
  "nate.com",
  "outlook.com",
  "icloud.com",
];

export default function EmailSplitInput({
  value,
  setValue,
  label = "이메일",
  required = true,
  disabled = false,
  className = "",
  domains = DEFAULT_DOMAINS,
}: EmailSplitInputProps) {
  // value → local + domain 로 분리해서 내부 상태로 관리
  const [localPart, setLocalPart] = useState("");
  const [domainPart, setDomainPart] = useState("");

  // 최초/외부 변경 반영
  useEffect(() => {
    const s = value.trim();
    const at = s.indexOf("@");
    if (at === -1) {
      setLocalPart(s);
      setDomainPart("");
    } else {
      setLocalPart(s.slice(0, at));
      setDomainPart(s.slice(at + 1));
    }
  }, [value]);

  // 내부 변경 → 상위 value 갱신
  useEffect(() => {
    const email = domainPart ? `${localPart}@${domainPart}` : localPart;
    setValue(email);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localPart, domainPart]);

  const onLocalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalPart(e.target.value);
  };

  const onDomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDomainPart(e.target.value.toLowerCase());
  };

  const onSelectDomain = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const picked = e.target.value;
    if (!picked) return;
    setDomainPart(picked.toLowerCase());
  };

  // 간단 유효성 (필요시 확장 가능)
  const invalid = useMemo(() => {
    if (!required && value.trim() === "") return false;
    const re = /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+$/;
    return value ? !re.test(value) : required;
  }, [value, required]);

  return (
    <div className={clsx("flex flex-col gap-2", className)}>
      <FormLabel label={label} required={required} />

      {/* 한 줄 레이아웃: [localinput] [@] [domaininput] [select] */}
      <div className="flex items-center gap-2">
        {/* 앞부분: 같은 길이 보장을 위해 basis-0 + grow */}
        <input
          type="text"
          inputMode="email"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          placeholder="example"
          disabled={disabled}
          value={localPart}
          onChange={onLocalChange}
          className={clsx(
            "min-w-0 basis-0 grow rounded-md border p-2",
            "focus:ring-2 focus:ring-brand-navy/20 focus:border-brand-navy",
            "border-gray-300",
            disabled && "opacity-60 cursor-not-allowed"
          )}
        />

        <span className="shrink-0 text-gray-600">@</span>

        {/* 뒷부분: 같은 길이 */}
        <input
          type="text"
          inputMode="url"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          placeholder="domain.com"
          disabled={disabled}
          value={domainPart}
          onChange={onDomainChange}
          className={clsx(
            "min-w-0 basis-0 grow rounded-md border p-2",
            "focus:ring-2 focus:ring-brand-navy/20 focus:border-brand-navy",
            "border-gray-300",
            disabled && "opacity-60 cursor-not-allowed"
          )}
        />

        {/* 오른쪽 끝 드롭다운 */}
        <select
          onChange={onSelectDomain}
          disabled={disabled}
          className={clsx(
            "shrink-0 w-40 rounded-md border p-2 bg-white",
            "focus:ring-2 focus:ring-brand-navy/20 focus:border-brand-navy",
            "border-gray-300",
            disabled && "opacity-60 cursor-not-allowed"
          )}
          defaultValue=""
          aria-label="도메인 선택"
        >
          <option value="" disabled>
            도메인 선택
          </option>
          {domains.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      {invalid ? (
        <p className="text-xs text-red-500">유효한 이메일 형식을 입력해 주세요.</p>
      ) : (
        <p className="text-xs text-gray-500">예: user@gmail.com</p>
      )}
    </div>
  );
}
