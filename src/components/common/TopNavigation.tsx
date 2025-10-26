import { useNavigate, useLocation } from "react-router-dom";

export default function TopNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  const buttons = [
    { name: "기본정보", path: "/member" },
    { name: "학력/연구/경력", path: "/education" },
    { name: "어학/자격/기타", path: "/services" },
  ];

  return (
    <header className="w-full">
      <nav className="flex">
        {buttons.map((btn) => {
          const isActive = location.pathname === btn.path;
          return (
            <button
              key={btn.path}
              onClick={() => navigate(btn.path)}
              className={`flex-1 py-3 font-semibold border transition-colors duration-200
                ${
                  isActive
                    ? "bg-brand-navy text-white border-brand-navy"
                    : "bg-white text-brand-navy border-brand-gray hover:bg-brand-deep hover:text-white"
                }`}
            >
              {btn.name}
            </button>
          );
        })}
      </nav>
    </header>
  );
}
