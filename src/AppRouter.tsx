import { BrowserRouter, Routes, Route } from "react-router-dom"
import App from "./App"
// import Login from "./pages/Login"
// import Profile from "./pages/Profile"
// import Dashboard from "./pages/Dashboard"
// import ErrorPage from "./pages/ErrorPage"

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        {/* <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/error" element={<ErrorPage />} /> */}
      </Routes>
    </BrowserRouter>
  )
}
