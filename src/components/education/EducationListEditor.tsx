import React from "react";

/**
 * 프론트 타입 정의 (백엔드 Enum/Entity에 맞춤)
 */
export type AdmissionType = "ENTRANCE" | "TRANSFER";
export type ClassTimeType = "DAY" | "NIGHT";
export type EducationLevel =
  | "GED"
  | "HIGH_SCHOOL"
  | "UNIVERSITY"
  | "GRADUATE_SCHOOL";
export type GraduationType =
  | "GRADUATED"
  | "BACHELOR"
  | "MASTER"
  | "DOCTOR"
  | "COMPLETED"
  | "EXPECTED"
  | "ENROLLED"
  | "LEAVE_OF_ABSENCE"
  | "DROPPED_OUT";
export type SchoolBranch = "MAIN_CAMPUS" | "SATELLITE_CAMPUS";

// 백엔드에 더 많은 지역이 있지만, 화면 예시용으로 필요한 만큼 노출
export type SchoolLocation =
  | "SEOUL"
  | "BUSAN"
  | "DAEGU"
  | "INCHEON"
  | "GWANGJU"
  | "DAEJEON"
  | "ULSAN"
  | "GYEONGGI"
  | "GANGWON"
  | "CHUNGBUK"
  | "CHUNGNAM"
  | "JEONBUK"
  | "JEONNAM"
  | "GYEONGBUK"
  | "GYEONGNAM"
  | "JEJU"
  | "SEJONG"
  | "USA"
  | "JAPAN";

export type MajorKind = "MAIN" | "PLURAL" | "SUB" | "LINKAGE" | "FUSION";

export interface MyMajor {
  myMajorId?: number | null;
  educationId?: number | null;
  majorKind?: MajorKind | "";
  score?: number | null; // 총점(또는 평균)
  majorStandard?: number | null; // 만점 기준
  creditsEarned?: number | null; // 이수 학점
  majorScore?: number | null; // 전공 학점
  mainMajorEarned?: number | null; // 전공 이수 학점
  mainMajorStandard?: number | null; // 전공 만점 기준
}

export interface Education {
  educationId?: number | null;
  memberId?: number | null;
  myMajorId?: number | null;

  educationLevel?: EducationLevel | "";
  admissionType?: AdmissionType | "";
  graduationType?: GraduationType | "";
  schoolName?: string;
  schoolLocation?: SchoolLocation | "";
  classTimeType?: ClassTimeType | "";
  schoolBranch?: SchoolBranch | "";
  startDate?: string; // YYYY-MM-DD
  endDate?: string;   // YYYY-MM-DD

  myMajor?: MyMajor; // 화면에서만 보조로 사용 (백엔드로 전송 시 분리 가능)
}

export interface EducationListEditorProps {
  value: Education[];
  setValue: (next: Education[]) => void;
  disabled?: boolean;
}

const LABELS = {
  AdmissionType: {
    ENTRANCE: "입학",
    TRANSFER: "편입",
  },
  ClassTimeType: {
    DAY: "주간",
    NIGHT: "야간",
  },
  EducationLevel: {
    GED: "검정고시",
    HIGH_SCHOOL: "고등학교",
    UNIVERSITY: "대학교",
    GRADUATE_SCHOOL: "대학원",
  },
  GraduationType: {
    GRADUATED: "졸업",
    BACHELOR: "학사",
    MASTER: "석사",
    DOCTOR: "박사",
    COMPLETED: "수료",
    EXPECTED: "졸업예정",
    ENROLLED: "재학중",
    LEAVE_OF_ABSENCE: "휴학",
    DROPPED_OUT: "중퇴",
  },
  SchoolBranch: {
    MAIN_CAMPUS: "본교",
    SATELLITE_CAMPUS: "분교",
  },
  SchoolLocation: {
    SEOUL: "서울",
    BUSAN: "부산",
    DAEGU: "대구",
    INCHEON: "인천",
    GWANGJU: "광주",
    DAEJEON: "대전",
    ULSAN: "울산",
    GYEONGGI: "경기",
    GANGWON: "강원",
    CHUNGBUK: "충북",
    CHUNGNAM: "충남",
    JEONBUK: "전북",
    JEONNAM: "전남",
    GYEONGBUK: "경북",
    GYEONGNAM: "경남",
    JEJU: "제주",
    SEJONG: "세종",
    USA: "미국",
    JAPAN: "일본",
  },
  MajorKind: {
    MAIN: "주전공",
    PLURAL: "복수전공",
    SUB: "부전공",
    LINKAGE: "연계전공",
    FUSION: "융합전공",
  },
} as const;

const isMyMajorAllowed = (level?: EducationLevel | ""): boolean => {
  return level === "UNIVERSITY" || level === "GRADUATE_SCHOOL";
};

const emptyEducation = (): Education => ({
  educationId: null,
  memberId: null,
  myMajorId: null,
  educationLevel: "",
  admissionType: "",
  graduationType: "",
  schoolName: "",
  schoolLocation: "",
  classTimeType: "",
  schoolBranch: "",
  startDate: "",
  endDate: "",
  myMajor: undefined,
});

const emptyMyMajor = (): MyMajor => ({
  myMajorId: null,
  educationId: null,
  majorKind: "",
  score: null,
  majorStandard: null,
  creditsEarned: null,
  majorScore: null,
  mainMajorEarned: null,
  mainMajorStandard: null,
});

function Select<K extends string | number>(props: {
  value: K | "" | undefined;
  onChange: (val: any) => void;
  options: { value: any; label: string }[];
  placeholder?: string;
  disabled?: boolean;
}) {
  const { value, onChange, options, placeholder, disabled } = props;
  return (
    <select
      className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm"
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value as any)}
      disabled={disabled}
    >
      <option value="">{placeholder ?? "선택"}</option>
      {options.map((opt) => (
        <option key={String(opt.value)} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

function TextInput(props: {
  value?: string;
  onChange: (val: string) => void;
  placeholder?: string;
  disabled?: boolean;
}) {
  const { value, onChange, placeholder, disabled } = props;
  return (
    <input
      type="text"
      className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm"
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
    />
  );
}

function NumberInput(props: {
  value?: number | null;
  onChange: (val: number | null) => void;
  placeholder?: string;
  disabled?: boolean;
}) {
  const { value, onChange, placeholder, disabled } = props;
  return (
    <input
      type="number"
      className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm"
      value={value ?? ""}
      onChange={(e) => {
        const v = e.target.value;
        onChange(v === "" ? null : Number(v));
      }}
      placeholder={placeholder}
      disabled={disabled}
    />
  );
}

function DateInput(props: {
  value?: string;
  onChange: (val: string) => void;
  disabled?: boolean;
}) {
  const { value, onChange, disabled } = props;
  return (
    <input
      type="date"
      className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm"
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
    />
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <div className="text-sm font-bold text-gray-700 mb-1">{children}</div>;
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-gray-200 p-4 shadow-sm bg-white">{children}</div>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 md:grid-cols-2 gap-3">{children}</div>;
}

export default function EducationListEditor({ value, setValue, disabled }: EducationListEditorProps) {
  const addEducation = () => {
    setValue([...(value ?? []), emptyEducation()]);
  };

  const removeEducation = (idx: number) => {
    const next = [...value];
    next.splice(idx, 1);
    setValue(next);
  };

  const updateAt = <K extends keyof Education>(idx: number, key: K, val: Education[K]) => {
    const next = [...value];
    const item = { ...(next[idx] ?? emptyEducation()) } as Education;

    // 교육 레벨 변경 시 전공 가능 여부에 따라 myMajor 정리
    if (key === "educationLevel") {
      const allowed = isMyMajorAllowed(val as EducationLevel | "");
      if (!allowed) {
        item.myMajor = undefined;
        item.myMajorId = null;
      }
    }

    (item as any)[key] = val;
    next[idx] = item;
    setValue(next);
  };

  const updateMyMajor = <K extends keyof MyMajor>(idx: number, key: K, val: MyMajor[K]) => {
    const next = [...value];
    const item = { ...(next[idx] ?? emptyEducation()) } as Education;
    const allowed = isMyMajorAllowed(item.educationLevel);
    if (!allowed) return; // 방어

    const major: MyMajor = item.myMajor ? { ...item.myMajor } : emptyMyMajor();
    (major as any)[key] = val;

    // 화면 상에서 educationId 연동(선택)
    if (item.educationId) major.educationId = item.educationId;

    item.myMajor = major;
    next[idx] = item;
    setValue(next);
  };

  const ensureMyMajor = (idx: number) => {
    const next = [...value];
    const item = { ...(next[idx] ?? emptyEducation()) } as Education;
    if (!item.myMajor) item.myMajor = emptyMyMajor();
    next[idx] = item;
    setValue(next);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-800">학력 사항</h2>
        <button
          type="button"
          onClick={addEducation}
          disabled={disabled}
          className="rounded-xl px-3 py-2 text-sm bg-gray-900 text-white hover:opacity-90 disabled:opacity-50"
        >
          + 추가
        </button>
      </div>

      {(value ?? []).length === 0 && (
        <div className="text-sm text-gray-500">추가 버튼을 눌러 학력을 입력하세요.</div>
      )}

      {(value ?? []).map((edu, idx) => {
        const myMajorAllowed = isMyMajorAllowed(edu.educationLevel);
        return (
          <Card key={idx}>
            <div className="flex items-start gap-3">
              <div className="flex-1 space-y-3">
                <Row>
                  <div>
                    <SectionTitle>학력 구분</SectionTitle>
                    <Select
                      value={edu.educationLevel ?? ""}
                      onChange={(v) => updateAt(idx, "educationLevel", v as EducationLevel)}
                      options={Object.entries(LABELS.EducationLevel).map(([value, label]) => ({ value, label }))}
                      placeholder="학력 구분 선택"
                      disabled={disabled}
                    />
                  </div>
                  <div>
                    <SectionTitle>입학 구분</SectionTitle>
                    <Select
                      value={edu.admissionType ?? ""}
                      onChange={(v) => updateAt(idx, "admissionType", v as AdmissionType)}
                      options={Object.entries(LABELS.AdmissionType).map(([value, label]) => ({ value, label }))}
                      placeholder="입학/편입 선택"
                      disabled={disabled}
                    />
                  </div>
                </Row>

                <Row>
                  <div>
                    <SectionTitle>졸업 구분</SectionTitle>
                    <Select
                      value={edu.graduationType ?? ""}
                      onChange={(v) => updateAt(idx, "graduationType", v as GraduationType)}
                      options={Object.entries(LABELS.GraduationType).map(([value, label]) => ({ value, label }))}
                      placeholder="졸업 구분 선택"
                      disabled={disabled}
                    />
                  </div>
                  <div>
                    <SectionTitle>학교명</SectionTitle>
                    <TextInput
                      value={edu.schoolName}
                      onChange={(v) => updateAt(idx, "schoolName", v)}
                      placeholder="예: 서울대학교"
                      disabled={disabled}
                    />
                  </div>
                </Row>

                <Row>
                  <div>
                    <SectionTitle>지역</SectionTitle>
                    <Select
                      value={edu.schoolLocation ?? ""}
                      onChange={(v) => updateAt(idx, "schoolLocation", v as SchoolLocation)}
                      options={Object.entries(LABELS.SchoolLocation).map(([value, label]) => ({ value, label }))}
                      placeholder="지역 선택"
                      disabled={disabled}
                    />
                  </div>
                  <div>
                    <SectionTitle>수업 시간대</SectionTitle>
                    <Select
                      value={edu.classTimeType ?? ""}
                      onChange={(v) => updateAt(idx, "classTimeType", v as ClassTimeType)}
                      options={Object.entries(LABELS.ClassTimeType).map(([value, label]) => ({ value, label }))}
                      placeholder="주/야간 선택"
                      disabled={disabled}
                    />
                  </div>
                </Row>

                <Row>
                  <div>
                    <SectionTitle>본교/분교</SectionTitle>
                    <Select
                      value={edu.schoolBranch ?? ""}
                      onChange={(v) => updateAt(idx, "schoolBranch", v as SchoolBranch)}
                      options={Object.entries(LABELS.SchoolBranch).map(([value, label]) => ({ value, label }))}
                      placeholder="본교/분교 선택"
                      disabled={disabled}
                    />
                  </div>
                  <div>
                    <SectionTitle>재학 기간</SectionTitle>
                    <div className="grid grid-cols-2 gap-2">
                      <DateInput
                        value={edu.startDate}
                        onChange={(v) => updateAt(idx, "startDate", v)}
                        disabled={disabled}
                      />
                      <DateInput
                        value={edu.endDate}
                        onChange={(v) => updateAt(idx, "endDate", v)}
                        disabled={disabled}
                      />
                    </div>
                  </div>
                </Row>

                {/* 전공 정보 (대학교/대학원에서만 입력 가능) */}
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <SectionTitle>전공 정보</SectionTitle>
                    {!myMajorAllowed && (
                      <span className="text-xs text-gray-500">대학교/대학원에서만 입력 가능합니다</span>
                    )}
                  </div>

                  <div className={myMajorAllowed ? "opacity-100" : "opacity-50 pointer-events-none"}>
                    <Row>
                      <div>
                        <SectionTitle>전공 구분</SectionTitle>
                        <Select
                          value={edu.myMajor?.majorKind ?? ""}
                          onChange={(v) => {
                            if (!edu.myMajor) ensureMyMajor(idx);
                            updateMyMajor(idx, "majorKind", v as MajorKind);
                          }}
                          options={Object.entries(LABELS.MajorKind).map(([value, label]) => ({ value, label }))}
                          placeholder="전공 구분 선택"
                          disabled={disabled || !myMajorAllowed}
                        />
                      </div>
                      <div>
                        <SectionTitle>총점 (또는 평균)</SectionTitle>
                        <NumberInput
                          value={edu.myMajor?.score ?? null}
                          onChange={(v) => {
                            if (!edu.myMajor) ensureMyMajor(idx);
                            updateMyMajor(idx, "score", v);
                          }}
                          placeholder="예: 4.3"
                          disabled={disabled || !myMajorAllowed}
                        />
                      </div>
                    </Row>

                    <Row>
                      <div>
                        <SectionTitle>만점 기준</SectionTitle>
                        <NumberInput
                          value={edu.myMajor?.majorStandard ?? null}
                          onChange={(v) => {
                            if (!edu.myMajor) ensureMyMajor(idx);
                            updateMyMajor(idx, "majorStandard", v);
                          }}
                          placeholder="예: 4.5"
                          disabled={disabled || !myMajorAllowed}
                        />
                      </div>
                      <div>
                        <SectionTitle>이수 학점</SectionTitle>
                        <NumberInput
                          value={edu.myMajor?.creditsEarned ?? null}
                          onChange={(v) => {
                            if (!edu.myMajor) ensureMyMajor(idx);
                            updateMyMajor(idx, "creditsEarned", v);
                          }}
                          placeholder="예: 130"
                          disabled={disabled || !myMajorAllowed}
                        />
                      </div>
                    </Row>

                    <Row>
                      <div>
                        <SectionTitle>전공 학점</SectionTitle>
                        <NumberInput
                          value={edu.myMajor?.majorScore ?? null}
                          onChange={(v) => {
                            if (!edu.myMajor) ensureMyMajor(idx);
                            updateMyMajor(idx, "majorScore", v);
                          }}
                          placeholder="예: 70"
                          disabled={disabled || !myMajorAllowed}
                        />
                      </div>
                      <div>
                        <SectionTitle>전공 이수 학점</SectionTitle>
                        <NumberInput
                          value={edu.myMajor?.mainMajorEarned ?? null}
                          onChange={(v) => {
                            if (!edu.myMajor) ensureMyMajor(idx);
                            updateMyMajor(idx, "mainMajorEarned", v);
                          }}
                          placeholder="예: 72"
                          disabled={disabled || !myMajorAllowed}
                        />
                      </div>
                    </Row>

                    <Row>
                      <div>
                        <SectionTitle>전공 만점 기준</SectionTitle>
                        <NumberInput
                          value={edu.myMajor?.mainMajorStandard ?? null}
                          onChange={(v) => {
                            if (!edu.myMajor) ensureMyMajor(idx);
                            updateMyMajor(idx, "mainMajorStandard", v);
                          }}
                          placeholder="예: 4.5"
                          disabled={disabled || !myMajorAllowed}
                        />
                      </div>
                      <div className="md:block hidden" />
                    </Row>
                  </div>
                </div>
              </div>

              <div className="pl-2">
                <button
                  type="button"
                  onClick={() => removeEducation(idx)}
                  disabled={disabled}
                  className="rounded-xl px-2.5 py-1.5 text-xs bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 disabled:opacity-50"
                >
                  삭제
                </button>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

/**
 * 사용 예시 (부모 컴포넌트)
 *
 * const [educations, setEducations] = useState<Education[]>([]);
 * <EducationListEditor value={educations} setValue={setEducations} />
 *
 * // 저장 시 (백엔드 전송)
 * // - Education[]
 * // - MyMajor는 edu.myMajor로 함께 담겨 있으니, 백엔드에서 분리/매핑하거나
 * //   프런트에서 (education, myMajor)로 나누어 DTO 만들어도 됩니다.
 */
