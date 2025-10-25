import { useEffect, useRef, useState } from "react";
import FormLabel from "@/components/common/FormLabel";
import { useDaumPostcodeLoader } from "@/hooks/useDaumPostcodeLoader";

type AddressInputProps = {
  addressNum: string; // ✅ 우편번호(5자리)
  address1: string; // 기본주소 (도로명/지번)
  address2: string; // 상세주소
  setAddressNum: React.Dispatch<React.SetStateAction<string>>;
  setAddress1: React.Dispatch<React.SetStateAction<string>>;
  setAddress2: React.Dispatch<React.SetStateAction<string>>;
  className?: string;
  required?: boolean;
  disabled?: boolean;
  /** 선택적으로, 카카오 oncomplete 원본 data를 받고 싶을 때 */
  onAddressSelected?: (data: any) => void;
  /** 기본주소 직접수정 허용 여부 (기본 false) */
  editableBase?: boolean;
  /** 우편번호 직접수정 허용 여부 (기본 false) */
  editableZip?: boolean;
};

export default function AddressInput({
  addressNum,
  address1,
  address2,
  setAddressNum,
  setAddress1,
  setAddress2,
  className = "",
  required = true,
  disabled = false,
  onAddressSelected,
  editableBase = false,
  editableZip = false,
}: AddressInputProps) {
  const { ready, error } = useDaumPostcodeLoader();
  const layerRef = useRef<HTMLDivElement | null>(null);
  const detailRef = useRef<HTMLInputElement | null>(null);

  const [open, setOpen] = useState(false);

  // 🔁 버튼 토글: 열려 있으면 닫고, 닫혀 있으면 엶
  const handleToggle = () => {
    if (!ready || !window.daum?.Postcode) return;
    setOpen((prev) => !prev);
  };

  useEffect(() => {
    if (!open || !ready || !window.daum?.Postcode || !layerRef.current) return;

    // 중복 임베드 방지
    layerRef.current.innerHTML = "";

    const post = new window.daum.Postcode({
      oncomplete: (data: any) => {
        // ✅ 우편번호 저장 (zonecode: 5자리)
        setAddressNum(data.zonecode || "");

        // 기본 주소 (도로명 우선, 없으면 지번)
        const base = data.roadAddress || data.jibunAddress || "";

        // 참고항목(법정동/건물명)
        let extra = "";
        if (data.bname) extra += data.bname;
        if (data.buildingName) extra += extra ? `, ${data.buildingName}` : data.buildingName;

        const baseWithExtra = extra ? `${base} (${extra})` : base;

        setAddress1(baseWithExtra);
        onAddressSelected?.(data); // 필요하면 외부에서 zonecode 등 활용 가능

        setOpen(false);
        // 상세주소로 포커스
        setTimeout(() => detailRef.current?.focus(), 0);
      },
      // 임베드 UI에서 닫기(X) 누르면 상태 끔
      onclose: () => {
        setOpen(false);
      },
      onresize: (size: { width: number; height: number }) => {
        if (layerRef.current) layerRef.current.style.height = `${size.height}px`;
      },
      width: "100%",
      height: "100%",
    });

    post.embed(layerRef.current, { autoClose: false });

    return () => {
      // 닫을 때 깔끔히 제거
      if (layerRef.current) {
        layerRef.current.innerHTML = "";
        layerRef.current.style.height = "0px";
      }
    };
  }, [open, ready, onAddressSelected, setAddress1, setAddressNum]);

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {/* 상단: 우편번호 + 버튼 */}
      <div className="flex items-end gap-2">
        <div className="w-36">
          <FormLabel label="우편번호" required={required} />
          <input
            type="text"
            inputMode="numeric"
            pattern="\d{5}"
            maxLength={5}
            value={addressNum}
            onChange={(e) => setAddressNum(e.target.value.replace(/\D+/g, "").slice(0, 5))}
            placeholder="예: 06236"
            className="w-full border border-gray-300 rounded-md p-2"
            readOnly={!editableZip}
            disabled={disabled}
          />
        </div>

        <div className="flex-1">
          <FormLabel label="주소 검색" required={required} />
          <button
            type="button"
            disabled={disabled || !!error || !ready}
            onClick={handleToggle}
            aria-expanded={open}
            className="px-3 py-2 rounded-md border border-brand-navy text-brand-navy font-medium hover:bg-brand-navy hover:text-white transition-colors disabled:opacity-50"
          >
            {open ? "닫기" : "주소 찾기"}
          </button>
          {error && (
            <p className="text-xs text-red-500 mt-1">
              우편번호 스크립트를 불러오지 못했습니다. 새로고침 후 다시 시도해 주세요.
            </p>
          )}
        </div>
      </div>

      {/* 임베드 레이어: open일 때만 표출 */}
      <div className={`${open ? "block" : "hidden"} border rounded-md overflow-hidden`}>
        <div ref={layerRef} style={{ width: "100%", minHeight: open ? 380 : 0 }} />
      </div>

      <div>
        <FormLabel label="기본주소" required={required} />
        <input
          type="text"
          value={address1}
          onChange={(e) => setAddress1(e.target.value)}
          placeholder="도로명 또는 지번 주소"
          className="w-full border border-gray-300 rounded-md p-2"
          readOnly={!editableBase}
          disabled={disabled}
        />
      </div>

      <div>
        <FormLabel label="상세주소" required={false} />
        <input
          ref={detailRef}
          type="text"
          value={address2}
          onChange={(e) => setAddress2(e.target.value)}
          placeholder="동/호수, 건물동/층 등"
          className="w-full border border-gray-300 rounded-md p-2"
          disabled={disabled}
        />
        <p className="text-xs text-gray-500 mt-1">주소 선택 후 상세주소를 입력해 주세요.</p>
      </div>
    </div>
  );
}

declare global {
  interface Window {
    daum?: any;
  }
}
