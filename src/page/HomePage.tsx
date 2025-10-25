import Header from "@/components/common/Header";
import HeroSection from "@/components/sections/HeroSection";
import HowItWorksSection from "@/components/sections/HowItWorksSection";
import Footer from "@/components/common/Footer";
import GoogleIcon from "@/components/icons/GoogleIcon";

const BACKEND_GOOGLE_LOGIN_URL = "http://localhost:8080/oauth2/authorization/google";
const GOOGLE_BUTTON_TEXT = "Google로 로그인";

export default function FirstPage() {
  return (
    <main className="min-h-full relative overflow-hidden">
      <Header
        showGoogleIcon={true}
        Icon={GoogleIcon}
        text={GOOGLE_BUTTON_TEXT}
        Url={BACKEND_GOOGLE_LOGIN_URL}
      />
      <HeroSection />
      <HowItWorksSection />
      <Footer />
    </main>
  );
}
