export default function Location() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="mb-8 text-center">
        <h1 className="font-cinzel text-3xl font-bold gold-text">📍 Location</h1>
        <p className="text-orange-300/70 mt-1">Find us on the map</p>
      </div>

      <div className="rounded-2xl overflow-hidden border border-orange-900/40 mb-6" style={{ minHeight: "350px", background: "#1A0400" }}>
        <iframe
          src="https://www.google.com/maps?q=16.3956074,81.4436037&z=16&output=embed"
          width="100%"
          height="350"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Lakshmipuram Location"
        />
      </div>

      <div className="rounded-2xl p-6 border border-orange-900/40" style={{ background: "#1A0400" }}>
        <div className="flex items-start gap-3 mb-5">
          <span className="text-orange-400 text-lg flex-shrink-0">🏛️</span>
          <div>
            <div className="font-semibold text-yellow-100">Lakshmipuram Ganesh Mandapam</div>
            <div className="text-orange-300/70">1st Cement Road</div>
            <div className="text-orange-300/70">Andhra Pradesh</div>
            <div className="text-orange-300/70">Pin: 521320</div>
          </div>
        </div>
        <a href="https://www.google.com/maps/dir/lakshmipuram,+Andhra+Pradesh+521320/lakshmipuram,+Andhra+Pradesh+521320/@16.3956074,81.4436037,18z" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-medium text-black transition-all hover:brightness-110" style={{ background: "linear-gradient(135deg, #FF6B00, #FFD700)" }}>
          🗺️ Open in Google Maps
        </a>
      </div>

      <div className="text-center mt-8 p-6 rounded-2xl border border-orange-900/30" style={{ background: "#1A0400" }}>
        <div className="text-3xl mb-3">🙏</div>
        <p className="font-cinzel text-orange-300 text-sm tracking-wider">
          Ganapati Bappa Morya • Mangalmurti Morya
        </p>
        <p className="text-orange-400/50 text-xs mt-2">Local Boys Committe</p>
      </div>
    </div>
  );
}