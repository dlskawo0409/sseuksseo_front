import FormLabel from "@/components/common/FormLabel";

interface BirthInputProps {
  value: string;
  setBirthDay: React.Dispatch<React.SetStateAction<string>>;
  className?: string;
}

export default function BirthInput({ value, setBirthDay, className = "" }: BirthInputProps) {
  return (
    <div className={`flex flex-col gap-2 max-w-sm ${className}`}>
      <FormLabel label="생년월일" required />
      <input
        type="date"
        value={value}
        onChange={(e) => setBirthDay(e.target.value)}
        className="border border-gray-300 rounded-md p-2"
      />
      <p className="text-xs text-gray-500 mt-1">선택된 날짜: {value || "없음"}</p>
    </div>
  );
}
