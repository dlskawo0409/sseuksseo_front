import { useEffect, useMemo, useState } from "react";
import Header from "@/components/common/Header";
import TopNavigation from "@/components/common/TopNavigation";
import EducationListEditor from "@/components/education/EducationListEditor"
import Divider from "@/components/common/Divider";

export default function EducationInputPage() {
    const [educations, setEducations] = useState<Education[]>([]);
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
                <Divider text="학력사항" className="mt-10 mb-10" />

                <EducationListEditor value={educations} setValue={setEducations} />


                </div>
            </div>
    </main>
    )
}