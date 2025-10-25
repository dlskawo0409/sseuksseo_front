import logoImage from "@/assets/sseuksseo_web_logo.svg";

interface LogoProps {
  small?: boolean;
}

export default function Logo({ small = false }: LogoProps) {
  return (
    <div className="flex items-center gap-3" aria-label="쓱써 로고">
      <img src={logoImage} alt="쓱써" className={`${small ? "w-12 h-12" : "w-16 h-16"}`} />
    </div>
  );
}
