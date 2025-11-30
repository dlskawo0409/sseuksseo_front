import { Link } from "react-router-dom";
import logoImage from "@/assets/sseuksseo_web_logo.svg";

interface LogoProps {
  small?: boolean;
}

export default function Logo({ small = false }: LogoProps) {
  return (
    <Link to="/" aria-label="쓱써 로고" className="flex items-center gap-3">
      <img src={logoImage} alt="쓱써" className={`${small ? "w-12 h-12" : "w-16 h-16"}`} />
    </Link>
  );
}
