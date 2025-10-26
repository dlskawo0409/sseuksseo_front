import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import HomePage from "@/page/HomePage";
import ResumePrefillPage from "@/page/ResumePrefillPage";
import EducationInputPage from "./page/educationInputPage";

export default function App() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   async function fetchStartPage() {
  //     try {
  //       const response = await fetch("http://localhost:8080/members/start-page", {
  //         credentials: "include", // 쿠키 기반 인증 시 필요
  //       });
  //       if (!response.ok) throw new Error("Failed to fetch start page");

  //       const data = await response.json();
  //       console.log(data);
  //       navigate(data.page);
  //     } catch (error) {
  //       console.error(error);
  //       navigate("/");
  //     } finally {
  //       setLoading(false);
  //     }
  //   }

  //   fetchStartPage();
  // }, [navigate]);

  // if (loading) return <div className="text-center mt-20">로딩 중...</div>;

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/member" element={<ResumePrefillPage />} />
      <Route path="/education" element={<EducationInputPage/>} />

      {/* 존재하지 않는 경로 처리 */}
      {/* <Route path="*" element={<NotFoundPage />} /> */}
    </Routes>
  );
}
