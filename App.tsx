import { useState } from "react";
import { StoreProvider, useStore } from "./store";
import Home from "./pages/Home";
import Programs from "./pages/Programs";
import Committee from "./pages/Committee";
import Chanda from "./pages/Chanda";
import Expenses from "./pages/Expenses";
import Gallery from "./pages/Gallery";
import Videos from "./pages/Videos";
import Announcements from "./pages/Announcements";
import Volunteers from "./pages/Volunteers";
import Location from "./pages/Location";

const PAGES = [
  { id: "home", label: "Home", icon: "🏠" },
  { id: "programs", label: "Programs", icon: "📅" },
  { id: "committee", label: "Committee", icon: "👥" },
  { id: "chanda", label: "Chanda", icon: "💰" },
  { id: "expenses", label: "Expenses", icon: "📊" },
  { id: "gallery", label: "Gallery", icon: "📸" },
  { id: "videos", label: "Videos", icon: "🎥" },
  { id: "announcements", label: "Announcements", icon: "📢" },
  { id: "volunteers", label: "Volunteers", icon: "🙏" },
  { id: "location", label: "Location", icon: "📍" },
];

function AppContent() {
  const [page, setPage] = useState("home");
  const [showLogin, setShowLogin] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAdmin, login, logout } = useStore();

  function handleLogin() {
    const ok = login(password);
    if (ok) {
      setShowLogin(false);
      setPassword("");
      setLoginError(false);
    } else {
      setLoginError(true);
    }
  }

  function navigate(p: string) {
    setPage(p);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="min-h-screen ganesh-gradient om-pattern">
      {/* Top Nav */}
      <nav className="sticky top-0 z-40 border-b border-orange-900/40" style={{ background: "rgba(13,2,0,0.95)", backdropFilter: "blur(12px)" }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <button onClick={() => navigate("home")} className="flex items-center gap-2 flex-shrink-0">
              <span className="text-2xl">🕉️</span>
              <div className="hidden sm:block">
                <div className="font-cinzel text-sm font-bold gold-text leading-tight">Lakshmipuram</div>
                <div className="font-cinzel text-xs text-orange-400 leading-tight">Ganesh Utsav 2026</div>
              </div>
            </button>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-1 overflow-x-auto">
              {PAGES.map(p => (
                <button
                  key={p.id}
                  onClick={() => navigate(p.id)}
                  className={`nav-link flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                    page === p.id
                      ? "text-yellow-300 bg-orange-900/30"
                      : "text-orange-300 hover:text-orange-100 hover:bg-orange-900/20"
                  } ${page === p.id ? "active" : ""}`}
                >
                  <span>{p.icon}</span>
                  <span>{p.label}</span>
                </button>
              ))}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2">
              {isAdmin ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-yellow-400 bg-yellow-900/30 px-3 py-1 rounded-full border border-yellow-700/40 hidden sm:inline">
                    🔐 Admin
                  </span>
                  <button
                    onClick={logout}
                    className="px-3 py-1.5 rounded-lg text-xs text-orange-300 border border-orange-700/40 hover:bg-orange-900/30 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowLogin(true)}
                  className="px-3 py-1.5 rounded-lg text-xs text-orange-300 border border-orange-700/40 hover:bg-orange-900/30 transition-colors"
                >
                  🔐 Admin
                </button>
              )}

              {/* Mobile menu button */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="lg:hidden p-2 rounded-lg text-orange-300 hover:bg-orange-900/30 transition-colors"
              >
                {menuOpen ? "✕" : "☰"}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="lg:hidden border-t border-orange-900/30 py-2" style={{ background: "rgba(13,2,0,0.98)" }}>
            <div className="grid grid-cols-2 gap-1 px-4">
              {PAGES.map(p => (
                <button
                  key={p.id}
                  onClick={() => navigate(p.id)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-left transition-colors ${
                    page === p.id
                      ? "text-yellow-300 bg-orange-900/40"
                      : "text-orange-300 hover:text-orange-100 hover:bg-orange-900/20"
                  }`}
                >
                  <span>{p.icon}</span>
                  <span>{p.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Scrollable horizontal nav for tablet */}
      <div className="hidden md:flex lg:hidden overflow-x-auto border-b border-orange-900/30 px-4 gap-1 py-2" style={{ background: "rgba(13,2,0,0.9)" }}>
        {PAGES.map(p => (
          <button
            key={p.id}
            onClick={() => navigate(p.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
              page === p.id
                ? "text-yellow-300 bg-orange-900/40"
                : "text-orange-300 hover:bg-orange-900/20"
            }`}
          >
            <span>{p.icon}</span>
            <span>{p.label}</span>
          </button>
        ))}
      </div>

      {/* Page content */}
      <main className="fade-in" key={page}>
        {page === "home" && <Home onNavigate={navigate} />}
        {page === "programs" && <Programs />}
        {page === "committee" && <Committee />}
        {page === "chanda" && <Chanda />}
        {page === "expenses" && <Expenses />}
        {page === "gallery" && <Gallery />}
        {page === "videos" && <Videos />}
        {page === "announcements" && <Announcements />}
        {page === "volunteers" && <Volunteers />}
        {page === "location" && <Location />}
      </main>

      {/* Admin login modal */}
      {showLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay" onClick={() => { setShowLogin(false); setLoginError(false); setPassword(""); }}>
          <div
            className="w-full max-w-sm rounded-2xl border border-orange-900/50 p-6 fade-in"
            style={{ background: "#1A0400" }}
            onClick={e => e.stopPropagation()}
          >
            <div className="text-center mb-6">
              <div className="text-4xl mb-3">🔐</div>
              <h2 className="font-cinzel text-xl font-bold gold-text">Admin Login</h2>
              <p className="text-orange-300/60 text-sm mt-1">Enter password to access admin panel</p>
            </div>
            <div className="space-y-4">
              <input
                type="password"
                value={password}
                onChange={e => { setPassword(e.target.value); setLoginError(false); }}
                onKeyDown={e => e.key === "Enter" && handleLogin()}
                placeholder="Enter admin password"
                autoFocus
              />
              {loginError && (
                <p className="text-red-400 text-sm text-center">❌ Incorrect password. Try again.</p>
              )}
              <button
                onClick={handleLogin}
                className="w-full py-3 rounded-xl text-black font-semibold hover:brightness-110 transition-all"
                style={{ background: "linear-gradient(135deg, #FF6B00, #FFD700)" }}
              >
                Login
              </button>
              <button
                onClick={() => { setShowLogin(false); setLoginError(false); setPassword(""); }}
                className="w-full py-2.5 rounded-xl text-orange-300 border border-orange-700/40 hover:bg-orange-900/30 transition-colors text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
