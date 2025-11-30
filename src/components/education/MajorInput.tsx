import EduRow from "@/components/education/EduRow";
import EduSectionTitle "@/components/education/EduSectionTitle";
import Dropbox from "@/components/common/Dropbox";
import Field from "@/components/common/Field";

export type EducationLevel = "GED" | "HIGH_SCHOOL" | "UNIVERSITY" | "GRADUATE_SCHOOL";
export type MajorLimit = 3.0 | 3.5 | 4.0 | 4.3 | 4.5 | 5.0 | 7.0 | 20 | 100;

export default function MajorInput({}) {
  return (
    <div>
      <EduRow>
        <div>
          {/* <EduSectionTitle>전공 구분</EduSectionTitle> */}
          <Dropbox<EducationLevel>
            label="전공 구분"
            placeholder="전공 구분 선택"
            className="max-w-sm flex-1"
          />
        </div>
        <div>
          {/* <EduSectionTitle>총점 (또는 평균)</EduSectionTitle> */}
          <Field
            label="총점 (또는 평균)"
            placeholder="예: 서울대학교"
          />
        </div>
      </EduRow>

      <EduRow>
        <div>
          {/* <EduSectionTitle>만점 기준</EduSectionTitle> */}
          <Dropbox<MajorLimit>
            label="만점 기준"
            placeholder="만점 기준"
            className="max-w-sm flex-1"
          />
        </div>
        <div>
          {/* <EduSectionTitle>이수 학점</EduSectionTitle> */}
          <Field
            label="이수 학점"
            placeholder="예: 서울대학교"
          />
        </div>
      </EduRow>

      <EduRow>
        <div>
          {/* <EduSectionTitle>전공 학점</EduSectionTitle> */}
          <Field
            label="전공 학점"
            placeholder="70"
          />
        </div>
        <div>
          {/* <EduSectionTitle>전공 이수 학점</EduSectionTitle> */}
          <Field
            label="전공 이수 학점"
            placeholder="72"
          />
        </div>
      </EduRow>

      <EduRow>
        <div>
          {/* <EduSectionTitle>전공 만점 기준</EduSectionTitle> */}
          <Field
            label="전공 이수 학점"
            placeholder="72"
          />
        </div>
        <div className="md:block hidden" />
      </EduRow>
    </div>
  );
}
