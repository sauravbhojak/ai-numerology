import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import HomePage from "./pages/HomePage";
import GeneratePage from "./pages/GeneratePage";
import LoadingPage from "./pages/LoadingPage";
import ReportPage from "./pages/ReportPage";
import DailyPage from "./pages/DailyPage";
import BlogPage from "./pages/BlogPage";
import ArticlePage from "./pages/ArticlePage";
import NotFoundPage from "./pages/NotFoundPage";
import ScrollToTop from "./components/ScrollToTop";

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#121024",
            color: "#D1D1D6",
            border: "1px solid rgba(212,175,55,0.3)",
          },
          success: { iconTheme: { primary: "#D4AF37", secondary: "#0A0915" } },
          error:   { iconTheme: { primary: "#ef4444", secondary: "#D1D1D6" } },
        }}
      />
      {/* ── BACKGROUND ZODIAC WHEEL ── */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden mix-blend-screen opacity-15" style={{ willChange: 'transform, opacity', transform: 'translate3d(0, 0, 0)', backfaceVisibility: 'hidden' }}>
        <img 
          src="/zodiac_wheel.png" 
          alt="Zodiac Chakra" 
          className="w-[900px] h-[900px] object-contain animate-spin-reverse"
          style={{ willChange: 'transform', transform: 'translate3d(0, 0, 0)', backfaceVisibility: 'hidden' }}
        />
      </div>
      <Routes>
        <Route path="/"         element={<HomePage />}     />
        <Route path="/generate" element={<GeneratePage />} />
        <Route path="/loading"  element={<LoadingPage />}  />
        <Route path="/report"   element={<ReportPage />}   />
        <Route path="/daily"    element={<DailyPage />}    />
        <Route path="/blogs"    element={<BlogPage />}    />
        <Route path="/blogs/:slug" element={<ArticlePage />} />
        <Route path="*"         element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
