import FormLabel from "@/components/common/FormLabel";

interface ServicePeriodInputProps {
  startDate: string;
  endDate: string;
  setStartDate: React.Dispatch<React.SetStateAction<string>>;
  setEndDate: React.Dispatch<React.SetStateAction<string>>;
  className?: string;
}

export default function ServicePeriodInput({
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  className = "",
}: ServicePeriodInputProps) {
  return (
    <div className={`flex flex-col gap-2 max-w-sm ${className}`}>
      <FormLabel label="복무 기간" required />

      <div className="flex items-center gap-2">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="flex-1 border border-gray-300 rounded-md p-2"
        />
        <span className="text-gray-500">~</span>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="flex-1 border border-gray-300 rounded-md p-2"
        />
      </div>

      <p className="text-xs text-gray-500 mt-1">
        선택된 기간:{" "}
        {startDate && endDate
          ? `${startDate} ~ ${endDate}`
          : startDate
          ? `${startDate} ~ (종료일 미선택)`
          : "없음"}
      </p>
    </div>
  );
}
