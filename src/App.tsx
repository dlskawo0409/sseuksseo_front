import { useState, useEffect, useRef } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import HomePage from "@/page/HomePage";
import ResumePrefillPage from "@/page/ResumePrefillPage";
import EducationInputPage from "@/page/educationInputPage";

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const ranRef = useRef(false); // StrictMode 중복 방지
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // '/' 가 아닐 땐 절대 실행하지 않음
    if (location.pathname !== "/") {
      setLoading(false);
      return;
    }
    if (ranRef.current) return; // dev 중복 방지
    ranRef.current = true;

    async function fetchStartPage() {
      try {
        const res = await fetch("http://localhost:8080/api/v1/members/start-page", {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch start page");
        const data = await res.json();
        // 현재 경로와 동일하면 불필요한 navigate 방지
        if (data.page && data.page !== location.pathname) {
          navigate(data.page);
        }
      } catch (e) {
        console.error(e);
        navigate("/");
      } finally {
        setLoading(false);
      }
    }

    fetchStartPage();
  }, [location.pathname, navigate]);

  if (loading) return <div className="text-center mt-20">로딩 중...</div>;

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/member" element={<ResumePrefillPage />} />
      <Route path="/education" element={<EducationInputPage />} />
    </Routes>
  );
}
