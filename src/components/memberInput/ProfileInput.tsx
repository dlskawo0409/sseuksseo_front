import React, { useEffect, useMemo, useRef, useState } from "react";

type ProfileInputProps = {
  label?: string;
  required?: boolean;
  file: File | null; // 외부 상태
  setFile: React.Dispatch<React.SetStateAction<File | null>>; // setter
  disabled?: boolean;
  className?: string;

  /** 허용 확장자(소문자, 점 없이) */
  allowedExt?: string[]; // 예: ["jpg","jpeg","png","webp","gif"]
  /** 허용 MIME 타입 */
  allowedMime?: string[]; // 예: ["image/jpeg","image/png","image/webp","image/gif"]
  /** 최대 용량(MB) */
  maxSizeMB?: number; // 기본 5MB
  /** 오류 메시지 커스텀 처리 (ex. 토스트) */
  onError?: (msg: string) => void;
};

function formatBytes(bytes: number) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

export default function ProfileInput({
  label = "프로필 사진",
  required = false,
  file,
  setFile,
  disabled = false,
  className = "",
  allowedExt = ["jpg", "jpeg", "png", "webp", "gif"],
  allowedMime = ["image/jpeg", "image/png", "image/webp", "image/gif"],
  maxSizeMB = 5,
  onError,
}: ProfileInputProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [error, setError] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const acceptAttr = useMemo(() => allowedExt.map((e) => `.${e}`).join(","), [allowedExt]);

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl("");
    }
  }, [file]);

  const raiseError = (msg: string) => {
    setError(msg);
    onError?.(msg);
  };

  const clearError = () => setError("");

  const validateFile = (f: File): boolean => {
    // 1) 용량 체크
    const maxBytes = maxSizeMB * 1024 * 1024;
    if (f.size > maxBytes) {
      raiseError(
        `이미지 용량이 초과되었습니다. (최대 ${maxSizeMB}MB, 현재 ${formatBytes(f.size)})`
      );
      return false;
    }

    // 2) 확장자 체크
    const ext = f.name.split(".").pop()?.toLowerCase() || "";
    if (!allowedExt.includes(ext)) {
      raiseError(`허용되지 않은 확장자입니다. (${allowedExt.join(", ")})`);
      return false;
    }

    // 3) MIME 타입 체크 (일부 브라우저/환경에서 빈 값일 수 있음 → 그 경우 확장자 기준 통과 시 허용)
    if (f.type && !allowedMime.includes(f.type)) {
      raiseError(`허용되지 않은 형식입니다. (${allowedMime.join(", ")})`);
      return false;
    }

    clearError();
    return true;
  };

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const picked = e.target.files[0];
    if (validateFile(picked)) {
      setFile(picked);
    } else {
      // 실패 시 input 값 초기화
      e.target.value = "";
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (disabled) return;

    const dropped = e.dataTransfer.files?.[0];
    if (dropped && validateFile(dropped)) {
      setFile(dropped);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (disabled) return;
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const openFileDialog = () => {
    if (!disabled) inputRef.current?.click();
  };

  const clearFile = () => {
    setFile(null);
    if (inputRef.current) inputRef.current.value = "";
    clearError();
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Label */}
      <label className="text-sm font-semibold text-brand-navy flex items-center gap-1 mb-2">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>

      {/* Dropzone / Preview */}
      <div
        onClick={openFileDialog}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={[
          "relative max-w-md rounded-lg border p-4 transition-all duration-200 cursor-pointer",
          disabled ? "opacity-60 cursor-not-allowed" : "",
          isDragging ? "border-brand-navy bg-brand-paper" : "border-gray-300 bg-white",
        ].join(" ")}
      >
        <input
          ref={inputRef}
          type="file"
          accept={acceptAttr}
          onChange={handleSelect}
          className="hidden"
          disabled={disabled}
        />

        {file && previewUrl ? (
          <div className="flex items-center gap-4">
            <img
              src={previewUrl}
              alt="미리보기"
              className="h-20 w-20 object-cover rounded-md border border-gray-200"
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-brand-navy truncate">{file.name}</p>
              <p className="text-xs text-gray-500">{formatBytes(file.size)}</p>

              <div className="mt-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={openFileDialog}
                  disabled={disabled}
                  className="px-3 py-1.5 text-xs font-semibold rounded-md border border-brand-gray text-brand-navy bg-white hover:bg-brand-paper"
                >
                  변경
                </button>
                <button
                  type="button"
                  onClick={clearFile}
                  disabled={disabled}
                  className="px-3 py-1.5 text-xs font-semibold rounded-md border border-red-300 text-red-600 bg-white hover:bg-red-50"
                >
                  삭제
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="mx-auto mb-2 h-10 w-10 rounded-full border border-dashed border-gray-400 flex items-center justify-center">
              <span className="text-xs text-gray-500">IMG</span>
            </div>
            <p className="text-sm text-gray-700 font-medium">
              이미지를 드래그&드롭하거나 클릭하여 선택
            </p>
            <p className="mt-1 text-xs text-gray-500">
              허용: {allowedExt.join(", ")} • 최대 {maxSizeMB}MB
            </p>
          </div>
        )}
      </div>

      {/* Error */}
      {error && <p className="mt-2 text-xs text-red-600 font-medium">{error}</p>}
    </div>
  );
}
