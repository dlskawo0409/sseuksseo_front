import GoogleIcon from "@/components/icons/GoogleIcon";
import ChromeIcon from "@/components/icons/ChromeIcon";
import HoverButton from "@/components/common/HoverButton";
import { BACKEND_GOOGLE_LOGIN_URL } from "@/config";

export default function HeroSection() {
  return (
    <section className="relative flex items-center bg-brand-paper">
      <div className="relative z-10 mx-auto max-w-6xl px-5 py-20 flex flex-col md:flex-row gap-10 items-center ">
        <div className="flex-1">
          <h1 className="text-5xl md:text-5xl font-extrabold leading-tight text-brand-gray mb-6">
            지원서, 매번 <br /> 쓰기 귀찮다면
            <br />
            <span className="relative inline-block">
              <span className="relative font-black text-6xl md:text-8xl text-brand-midnight">
                "쓱써"
              </span>
            </span>
            가 <br />
            자동으로 <br />
            채워드려요
          </h1>
          <p className="mt-5 text-xl text-gray-600 leading-relaxed">
            여러 취업 사이트마다 같은 정보를 반복 입력하는 수고를 줄이세요.
            <br />
            <span className="font-semibold text-brand-midnight">쓱 저장하고, 쓱—써드릴게요.</span>
          </p>

          {/* 버튼 영역 */}
          <div className="mt-10 flex flex-wrap items-center gap-6">
            <HoverButton
              href={BACKEND_GOOGLE_LOGIN_URL}
              text="Google로 시작하기"
              Icon={GoogleIcon}
            />

            <HoverButton
              href={BACKEND_GOOGLE_LOGIN_URL}
              text="크롬 확장자 바로가기"
              Icon={ChromeIcon}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
