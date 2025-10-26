import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Header from "@/components/common/Header";
import Field from "@/components/common/Field";
import TopNavigation from "@/components/common/TopNavigation";
import ProfileInput from "@/components/memberInput/ProfileInput";
import BirthInput from "@/components/memberInput/BirthInput";
import AddressInput from "@/components/memberInput/AddressInput";
import EmailInput from "@/components/memberInput/EmailInput";
import PhoneNumberInput from "@/components/memberInput/PhoneNumberInput";
import DisabilityField from "@/components/memberInput/DisabilityField";
import VeteranCompactSelector from "@/components/memberInput/VeteranCompactSelector";
import Divider from "@/components/common/Divider";
import RadioSelector from "@/components/common/RadioSelector";
import Dropbox from "@/components/common/Dropbox";
import ServicePeriodInput from "@/components/memberInput/ServicePeriodInput";

// ✅ http 유틸 임포트 (네가 준 유틸)
import { http } from "@/lib/https";

// ----------------- 타입들 -----------------
type Gender = "MALE" | "FEMALE" | "";
const genderOptions = [
  { value: "MALE", label: "남" },
  { value: "FEMALE", label: "여" },
];

type MilitaryStatus = "NOT_APPLICABLE" | "COMPLETED" | "NOT_COMPLETED" | "EXEMPTED" | "SERVING";
const militaryStatusOptions = [
  { value: "NOT_APPLICABLE" as MilitaryStatus, label: "비대상" },
  { value: "COMPLETED" as MilitaryStatus, label: "군필" },
  { value: "NOT_COMPLETED" as MilitaryStatus, label: "미필" },
  { value: "EXEMPTED" as MilitaryStatus, label: "면제" },
  { value: "SERVING" as MilitaryStatus, label: "복무중" },
];

type ServiceType =
  | "ARMY"
  | "NAVY"
  | "AIR_FORCE"
  | "MARINE_CORPS"
  | "PUBLIC_SERVICE"
  | "ALTERNATIVE";

const serviceTypeOptions = [
  { value: "ARMY" as ServiceType, label: "육군" },
  { value: "NAVY" as ServiceType, label: "해군" },
  { value: "AIR_FORCE" as ServiceType, label: "공군" },
  { value: "MARINE_CORPS" as ServiceType, label: "해병대" },
  { value: "PUBLIC_SERVICE" as ServiceType, label: "공익근무요원" },
  { value: "ALTERNATIVE" as ServiceType, label: "병역특례복무" },
];

type BranchType =
  | "INFANTRY"
  | "ARMOR"
  | "ARTILLERY"
  | "AIR_DEFENSE"
  | "ARMY_AVIATION"
  | "SPECIAL_FORCES"
  | "ENGINEER"
  | "SIGNAL"
  | "MILITARY_INTELLIGENCE"
  | "CHEMICAL"
  | "PSYCHOLOGICAL_WARFARE"
  | "QUARTERMASTER"
  | "ORDNANCE"
  | "TRANSPORTATION"
  | "ADJUTANT_GENERAL"
  | "JUDGE_ADVOCATE"
  | "MILITARY_POLICE"
  | "MEDICAL"
  | "CHAPLAIN";

const branchOptions = [
  { value: "INFANTRY" as BranchType, label: "보병" },
  { value: "ARMOR" as BranchType, label: "기갑" },
  { value: "ARTILLERY" as BranchType, label: "포병" },
  { value: "AIR_DEFENSE" as BranchType, label: "방공" },
  { value: "ARMY_AVIATION" as BranchType, label: "항공" },
  { value: "SPECIAL_FORCES" as BranchType, label: "특전사" },
  { value: "ENGINEER" as BranchType, label: "공병" },
  { value: "SIGNAL" as BranchType, label: "통신" },
  { value: "MILITARY_INTELLIGENCE" as BranchType, label: "정보" },
  { value: "CHEMICAL" as BranchType, label: "화학" },
  { value: "PSYCHOLOGICAL_WARFARE" as BranchType, label: "심리전" },
  { value: "QUARTERMASTER" as BranchType, label: "병참" },
  { value: "ORDNANCE" as BranchType, label: "병기" },
  { value: "TRANSPORTATION" as BranchType, label: "수송" },
  { value: "ADJUTANT_GENERAL" as BranchType, label: "인사행정" },
  { value: "JUDGE_ADVOCATE" as BranchType, label: "군법무" },
  { value: "MILITARY_POLICE" as BranchType, label: "헌병" },
  { value: "MEDICAL" as BranchType, label: "의무" },
  { value: "CHAPLAIN" as BranchType, label: "군종" },
];

type MilitaryRank =
  | "PRIVATE"
  | "PRIVATE_FIRST_CLASS"
  | "CORPORAL"
  | "SERGEANT"
  | "STAFF_SERGEANT"
  | "SERGEANT_FIRST_CLASS"
  | "MASTER_SERGEANT"
  | "SERGEANT_MAJOR"
  | "SECOND_LIEUTENANT"
  | "FIRST_LIEUTENANT"
  | "CAPTAIN"
  | "MAJOR"
  | "LIEUTENANT_COLONEL"
  | "COLONEL"
  | "BRIGADIER_GENERAL"
  | "MAJOR_GENERAL"
  | "LIEUTENANT_GENERAL"
  | "GENERAL";

const militaryRankOptions = [
  { value: "PRIVATE" as MilitaryRank, label: "이등병" },
  { value: "PRIVATE_FIRST_CLASS" as MilitaryRank, label: "일등병" },
  { value: "CORPORAL" as MilitaryRank, label: "상병" },
  { value: "SERGEANT" as MilitaryRank, label: "병장" },
  { value: "STAFF_SERGEANT" as MilitaryRank, label: "하사" },
  { value: "SERGEANT_FIRST_CLASS" as MilitaryRank, label: "중사" },
  { value: "MASTER_SERGEANT" as MilitaryRank, label: "상사" },
  { value: "SERGEANT_MAJOR" as MilitaryRank, label: "원사" },
  { value: "SECOND_LIEUTENANT" as MilitaryRank, label: "소위" },
  { value: "FIRST_LIEUTENANT" as MilitaryRank, label: "중위" },
  { value: "CAPTAIN" as MilitaryRank, label: "대위" },
  { value: "MAJOR" as MilitaryRank, label: "소령" },
  { value: "LIEUTENANT_COLONEL" as MilitaryRank, label: "중령" },
  { value: "COLONEL" as MilitaryRank, label: "대령" },
  { value: "BRIGADIER_GENERAL" as MilitaryRank, label: "준장" },
  { value: "MAJOR_GENERAL" as MilitaryRank, label: "소장" },
  { value: "LIEUTENANT_GENERAL" as MilitaryRank, label: "중장" },
  { value: "GENERAL" as MilitaryRank, label: "대장" },
];

// ----------------- API 타입 & 모듈 -----------------
type MemberRequestPayload = {
  member: {
    koreanName: string;
    englishName: string;
    hanjaName: string;
    gender: string;
    birthDay: string;
    addressNum: string;
    address: string;
    addressDetail: string;
    email: string;
    phoneNum: string;
  };
  disability: {
    disabilityType?: string;
    disabilityLevel?: "심한 장애인" | "심하지 않은 장애인" | "";
  };
  veteran: {
    veteranNo?: string;
    veteranRatio?: 0 | 5 | 10;
  };
  military: {
    status?: MilitaryStatus | "";
    serviceType?: ServiceType | "";
    branch?: BranchType | "";
    rank?: MilitaryRank | "";
    militaryStartDate?: string;
    militaryEndDate?: string;
  };
};

type MemberBundleResponse = {
  id: number;
  memberId?: number;
  message?: string;
};

// 실제 엔드포인트로 교체
const BASE_PATH = "/api/v1/member/init";

const MemberBundleApi = {
  saveAll(
    payload: MemberRequestPayload,
    opts?: { withCredentials?: boolean; bearerToken?: string | null; timeoutMs?: number }
  ) {
    return http.post<MemberBundleResponse, MemberRequestPayload>(`${BASE_PATH}`, payload, {
      withCredentials: opts?.withCredentials ?? true,
      bearerToken: opts?.bearerToken ?? null,
      timeoutMs: opts?.timeoutMs ?? 15000,
    });
  },
};

// ----------------- 컴포넌트 -----------------
export default function ResumePrefillPage() {
  const navigate = useNavigate();

  // 폼 상태
  const [consent, setConsent] = useState<boolean>(true);
  const [koreanName, setKoreanName] = useState("");
  const [englishName, setEnglishName] = useState("");
  const [hanjaName, setHanJaName] = useState("");
  const [gender, setGender] = useState<Gender>("");
  const [birthDay, setBirthDay] = useState<string>("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [addressNum, setAddressNum] = useState("");
  const [address, setAddress] = useState("");
  const [addressDetail, setAddressDetail] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNum, setPhoneNum] = useState("");
  const [disability, setDisability] = useState("");
  const [disabilityType, setDisabilityType] = useState("");
  const [disabilityLevel, setDisabilityLevel] = useState<"" | "심한 장애인" | "심하지 않은 장애인">(
    ""
  );
  const [veteran, setVeteran] = useState<{
    eligibility: "" | "대상" | "비대상";
    veteranNo?: string;
    ratio: 0 | 5 | 10;
  }>({
    eligibility: "",
    veteranNo: "",
    ratio: 0,
  });
  const [militaryStatus, setMilitaryStatus] = useState<MilitaryStatus | "">("");
  const [serviceType, setServiceType] = useState<ServiceType | "">("");
  const [branch, setBranch] = useState<BranchType | "">("");
  const [rank, setRank] = useState<MilitaryRank | "">("");
  const [militaryStartDate, setMilitaryStartDate] = useState("");
  const [militaryEndDate, setMilitaryEndDate] = useState("");

  // UI 상태
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [okMsg, setOkMsg] = useState<string | null>(null);

  const isServiceTypeEnabled = militaryStatus === "COMPLETED" || militaryStatus === "SERVING";
  useEffect(() => {
    if (!isServiceTypeEnabled) {
      setServiceType("");
      setBranch("");
      setRank("");
      setMilitaryStartDate("");
      setMilitaryEndDate("");
    }
  }, [isServiceTypeEnabled]);

  const canSubmit = useMemo(() => {
    if (!koreanName || !englishName || !hanjaName) return false;
    if (!gender) return false;
    if (!birthDay) return false;
    if (!photo) return false; // ⚠️ 현재는 파일을 서버로 안보내는 JSON 전송. 파일 업로드 시 FormData 분기 필요.

    // 주소
    if (!addressNum || !address || !addressDetail) return false;

    // 연락처
    if (!email || !phoneNum) return false;

    // 보훈
    if (!veteran.eligibility) return false;
    if (veteran.eligibility === "대상") {
      if (!veteran.veteranNo) return false;
      if (!veteran.ratio || veteran.ratio <= 0) return false;
    }

    // 병역
    if (!militaryStatus) return false;
    if (["SERVING", "COMPLETED"].includes(militaryStatus)) {
      if (!serviceType || !branch || !rank) return false;
      if (!militaryStartDate || !militaryEndDate) return false;
    }

    return true;
  }, [
    koreanName,
    englishName,
    hanjaName,
    gender,
    birthDay,
    photo,
    addressNum,
    address,
    addressDetail,
    email,
    phoneNum,
    veteran.eligibility,
    veteran.veteranNo,
    veteran.ratio,
    militaryStatus,
    serviceType,
    branch,
    rank,
    militaryStartDate,
    militaryEndDate,
  ]);

  // SweetAlert로 사전 안내(선택)
  const showSubmitCheck = () => {
    if (canSubmit) {
      Swal.fire({
        icon: "success",
        title: "✅ 제출 가능!",
        text: "폼이 유효합니다. 저장을 진행합니다.",
        confirmButtonColor: "#0D2840",
      });
    } else {
      Swal.fire({
        icon: "warning",
        title: "⚠️ 제출 불가",
        text: "필수 항목을 모두 입력해주세요.",
        confirmButtonColor: "#0D2840",
      });
    }
  };

  // 실제 제출
  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (submitting) return;
    if (!canSubmit) {
      showSubmitCheck();
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);
    setOkMsg(null);

    const payload: MemberRequestPayload = {
      member: {
        koreanName: koreanName.trim(),
        englishName: englishName.trim(),
        hanjaName: hanjaName.trim(),
        gender: gender.trim(),
        birthDay: birthDay.trim(),
        addressNum: addressNum.trim(),
        address: address.trim(),
        addressDetail: addressDetail.trim(),
        email: email.trim(),
        phoneNum: phoneNum.trim(),
      },
      disability: {
        disabilityType: disabilityType?.trim(),
        disabilityLevel: disabilityLevel,
      },
      veteran: {
        veteranNo: veteran.veteranNo?.trim(),
        veteranRatio: veteran.ratio as 0 | 5 | 10,
      },
      military: {
        status: militaryStatus,
        serviceType,
        branch,
        rank,
        militaryStartDate,
        militaryEndDate,
      },
    };

    try {
      // ⚠️ 사진 업로드 필요 시:
      // const form = new FormData();
      // form.append("json", new Blob([JSON.stringify(payload)], { type: "application/json" }));
      // if (photo) form.append("photo", photo);
      // -> 이 경우 http.post를 FormData 분기로 보내도록 http 유틸 사용 (Content-Type 자동)

      const res = await MemberBundleApi.saveAll(payload, {
        withCredentials: true, // 쿠키 기반 세션이면 true
        // bearerToken: accessToken, // Bearer 전략이면 여기에
      });

      setOkMsg(res.message ?? "저장되었습니다.");
      Swal.fire({
        icon: "success",
        title: "저장 완료",
        text: res.message ?? "저장되었습니다.",
        confirmButtonColor: "#0D2840",
      });
      // navigate("/next"); // 필요 시 라우팅
    } catch (e: any) {
      console.error(e);
      const msg = e?.message ?? "요청 중 오류가 발생했습니다.";
      setErrorMsg(msg);
      Swal.fire({
        icon: "error",
        title: "저장 실패",
        text: msg,
        confirmButtonColor: "#0D2840",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // ✅ 여기서 더 이상 불필요한 "};" 같은 닫힘을 넣지 마세요.

  return (
    <main className="min-h-full relative overflow-hidden">
      <Header showIcon={false} />
      <div className="min-h-screen bg-brand-paper">
        <div className="mx-auto max-w-5xl px-5 py-12">
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-extrabold text-brand-ink">
              이력서 사전작성으로 시간을 절약해요 ✨
            </h1>
            <p className="mt-3 text-brand-navy/80 leading-relaxed">
              로그인해주셔서 감사합니다. 몇 가지 기본 정보를 알려주시면, 지원서 작성 시 자동으로
              채워드릴게요. 언제든지 수정할 수 있습니다.
            </p>
          </header>

          <TopNavigation />
          <Divider text="기본정보" className="mt-10 mb-10" />

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex gap-4">
              <div className="flex-1">
                <Field
                  label="이름"
                  required={consent}
                  value={koreanName}
                  onChange={setKoreanName}
                  placeholder="홍길동"
                  disabled={!consent}
                />
              </div>
              <div className="flex-1">
                <Field
                  label="영문이름"
                  required={consent}
                  value={englishName}
                  onChange={setEnglishName}
                  placeholder="Hong Gil-Dong"
                  disabled={!consent}
                />
              </div>
              <div className="flex-1">
                <Field
                  label="한자이름"
                  required={consent}
                  value={hanjaName}
                  onChange={setHanJaName}
                  placeholder="洪吉童"
                  disabled={!consent}
                />
              </div>
            </div>

            <div className="flex">
              <RadioSelector
                label="성별"
                required
                value={gender}
                onChange={setGender}
                options={genderOptions}
              />
              <div className="ml-10" />
              <BirthInput value={birthDay} setBirthDay={setBirthDay} />
            </div>

            <Divider text="인적사항" className="mt-10 mb-10" />

            <ProfileInput
              label="프로필 사진"
              required
              file={photo}
              setFile={setPhoto}
              maxSizeMB={3}
              allowedExt={["jpg", "jpeg", "png", "webp"]}
              onError={(msg: string) => console.warn(msg)}
            />

            <div className="mt-10" />

            <AddressInput
              address1={address}
              address2={addressDetail}
              addressNum={addressNum}
              setAddress1={setAddress}
              setAddress2={setAddressDetail}
              setAddressNum={setAddressNum}
            />

            <div className="mt-10" />

            <EmailInput value={email} setValue={setEmail} />
            <PhoneNumberInput value={phoneNum} setValue={setPhoneNum} storeMode="digits" />

            <DisabilityField
              value={disability}
              setValue={setDisability}
              disabilityLevel={disabilityLevel}
              setDisabilityLevel={setDisabilityLevel}
              disabilityType={disabilityType}
              setDisabilityType={setDisabilityType}
              required
              onValidChange={(ok: boolean) => console.log("disability valid?", ok)}
            />

            <VeteranCompactSelector
              value={veteran}
              setValue={setVeteran}
              required
              onValidChange={(ok: boolean) => console.log("보훈 compact valid?", ok)}
            />

            <Divider text="병력사항" className="mt-10 mb-10" />

            <RadioSelector
              label="병역 상태"
              required
              value={militaryStatus}
              onChange={setMilitaryStatus}
              options={militaryStatusOptions}
            />

            <div className="flex gap-4">
              <Dropbox<ServiceType>
                label="군별"
                input={serviceTypeOptions}
                value={serviceType}
                setValue={setServiceType}
                disabled={!isServiceTypeEnabled}
                placeholder="군별 선택"
                className="max-w-sm flex-1"
              />
              <Dropbox<BranchType>
                label="병과"
                input={branchOptions}
                value={branch}
                setValue={setBranch}
                disabled={!isServiceTypeEnabled}
                placeholder="병과 선택"
                className="max-w-sm flex-1"
              />
            </div>

            <div className="flex gap-4">
              <Dropbox<MilitaryRank>
                label="계급"
                input={militaryRankOptions}
                value={rank}
                setValue={setRank}
                placeholder="계급 선택"
                className="max-w-sm flex-1"
              />
              <ServicePeriodInput
                startDate={militaryStartDate}
                endDate={militaryEndDate}
                setStartDate={setMilitaryStartDate}
                setEndDate={setMilitaryEndDate}
              />
            </div>

            {errorMsg && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-red-700">
                {errorMsg}
              </div>
            )}
            {okMsg && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-emerald-700">
                {okMsg}
              </div>
            )}

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={submitting || !canSubmit}
                className="inline-flex items-center justify-center rounded-2xl px-5 py-3 text-white shadow-sm transition disabled:opacity-50 bg-brand-navy hover:bg-brand-deep"
                onClick={showSubmitCheck} // 클릭 시 상태 안내(선택)
              >
                {submitting ? "저장 중..." : "저장하기"}
              </button>
            </div>

            <p className="text-xs text-brand-gray/90">
              * 입력한 정보는 자동 작성 목적 이외에는 사용되지 않으며, 언제든 마이페이지에서
              수정/삭제할 수 있습니다.
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}
