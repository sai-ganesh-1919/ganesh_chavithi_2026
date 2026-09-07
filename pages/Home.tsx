import { useStore } from "../store";

interface HomeProps {
  onNavigate: (page: string) => void;
}

export default function Home({ onNavigate }: HomeProps) {
  const { announcements, programs } = useStore();

  const today = new Date();
  const upcoming = programs
    .filter(p => new Date(p.date) >= today)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  const pinned = announcements.filter(a => a.pinned).slice(0, 2);

  const quickLinks = [
    { icon: "📅", label: "Programs", page: "programs" },
    { icon: "👥", label: "Committee", page: "committee" },
    { icon: "💰", label: "Chanda", page: "chanda" },
    { icon: "📸", label: "Gallery", page: "gallery" },
    { icon: "🎥", label: "Videos", page: "videos" },
    { icon: "📢", label: "Announcements", page: "announcements" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative overflow-hidden" style={{ minHeight: "90vh" }}>
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1598209437948-3f0ae8a0e45d?w=1400&h=900&fit=crop&auto=format"
            alt="Lord Ganesh adorned with flowers"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(13,2,0,0.7) 0%, rgba(13,2,0,0.4) 40%, rgba(13,2,0,0.85) 80%, rgba(13,2,0,1) 100%)" }} />
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 pt-20 pb-16" style={{ minHeight: "90vh" }}>
          <div className="text-5xl mb-4 diya-glow">🕉️</div>
          <p className="text-orange-300 text-lg font-medium tracking-widest uppercase mb-2 font-cinzel">Sri Ganeshaya Namaha</p>
          <h1 className="font-cinzel text-5xl md:text-7xl font-black mb-4 leading-tight">
            <span className="gold-text">Lakshmipuram</span>
            <br />
            <span className="text-white">Ganesh</span>
          </h1>
          <p className="text-2xl font-cinzel text-orange-300 mb-2">Ganesh Chaturthi 2026</p>
          <p className="text-orange-200 text-lg mb-8">September 14 – September 20, 2026</p>

          <div className="flex flex-wrap gap-4 justify-center mb-12">
            <button
              onClick={() => onNavigate("programs")}
              className="px-8 py-3 rounded-full font-semibold text-black transition-all hover:brightness-110 hover:scale-105"
              style={{ background: "linear-gradient(135deg, #FF6B00, #FFD700)" }}
            >
              View Programs
            </button>
            <button
              onClick={() => onNavigate("chanda")}
              className="px-8 py-3 rounded-full font-semibold text-orange-300 border border-orange-500/60 hover:bg-orange-900/40 transition-all"
            >
              Contribute Chanda
            </button>
          </div>

          {/* Festival stats */}
          <div className="grid grid-cols-3 gap-8 max-w-md mx-auto">
            {[
              { num: "10", label: "Days" },
              { num: "10", label: "Programs" },
              { num: "12", label: "Members" },
            ].map(s => (
              <div key={s.label} className="text-center">
                <div className="font-cinzel text-3xl font-bold gold-text">{s.num}</div>
                <div className="text-orange-300 text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick links */}
      <div className="px-4 py-12 max-w-5xl mx-auto">
        <h2 className="font-cinzel text-2xl text-center gold-text mb-8">Quick Access</h2>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {quickLinks.map(link => (
            <button
              key={link.page}
              onClick={() => onNavigate(link.page)}
              className="flex flex-col items-center gap-2 p-4 rounded-xl border border-orange-900/40 hover:border-orange-500/60 hover:bg-orange-900/20 transition-all card-hover"
            >
              <span className="text-3xl">{link.icon}</span>
              <span className="text-sm text-orange-200 font-medium">{link.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Upcoming programs */}
      {upcoming.length > 0 && (
        <div className="px-4 py-10 max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-cinzel text-2xl gold-text">Upcoming Programs</h2>
            <button onClick={() => onNavigate("programs")} className="text-orange-400 text-sm hover:text-orange-300 transition-colors">
              View All →
            </button>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {upcoming.map(p => (
              <div key={p.id} className="rounded-xl p-5 border border-orange-900/40 card-hover" style={{ background: "#1A0400" }}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">📅</span>
                  <span className="text-orange-300 text-sm font-medium">
                    {new Date(p.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} • {p.time}
                  </span>
                </div>
                <h3 className="font-semibold text-cream mb-1" style={{ color: "#FFF5E0" }}>{p.name}</h3>
                <p className="text-orange-300/70 text-sm">📍 {p.venue}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Announcements */}
      {pinned.length > 0 && (
        <div className="px-4 py-10 max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-cinzel text-2xl gold-text">📢 Latest Announcements</h2>
            <button onClick={() => onNavigate("announcements")} className="text-orange-400 text-sm hover:text-orange-300 transition-colors">
              View All →
            </button>
          </div>
          <div className="space-y-4">
            {pinned.map(a => (
              <div key={a.id} className="rounded-xl p-5 border border-orange-500/30 card-hover" style={{ background: "#1A0400" }}>
                <div className="flex items-start gap-3">
                  <span className="text-yellow-400 text-lg mt-0.5">📌</span>
                  <div>
                    <h3 className="font-semibold text-yellow-300 mb-1">{a.title}</h3>
                    <p className="text-orange-200/80 text-sm leading-relaxed">{a.content}</p>
                    <p className="text-orange-400/60 text-xs mt-2">
                      {new Date(a.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer band */}
      <div className="text-center py-10 border-t border-orange-900/30 mt-8">
        <div className="text-3xl mb-2">🙏</div>
        <p className="font-cinzel text-orange-300 text-sm tracking-wider">
          Ganapati Bappa Morya • Mangalmurti Morya
        </p>
        <p className="text-orange-400/50 text-xs mt-2">Lakshmipuram Local Boys</p>
      </div>
    </div>
  );
}