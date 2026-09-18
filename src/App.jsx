import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Programs from "./pages/Programs";
import NotFound from "./pages/NotFound";

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Toaster
        position="top-right"
        gutter={12}
        toastOptions={{
          duration: 4500,
          style: {
            border: "1px solid var(--border)",
            borderRadius: "10px",
            padding: "12px 14px",
            color: "var(--ink)",
            boxShadow: "0 10px 24px rgba(30, 37, 64, 0.14)",
            maxWidth: "460px",
          },
          success: {
            style: {
              borderColor: "#9fd8b8",
            },
          },
          error: {
            duration: 5200,
            style: {
              borderColor: "#f3b0b0",
            },
          },
        }}
      />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/fitness" element={<Programs />} />
          <Route path="/programs" element={<Navigate to="/fitness" replace />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
