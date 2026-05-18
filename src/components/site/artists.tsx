"use client";

import { useEffect, useState } from "react";

const artistImages = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&q=80",
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&q=80",
  "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=500&q=80",
  "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&q=80",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
  "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400&q=80",
  "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=400&q=80",
];

export function ArtistsSection() {
  const [activeIndex, setActiveIndex] = useState(2);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % artistImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const getVisible = () => {
    const visible = [];
    for (let i = -2; i <= 2; i++) {
      const idx = (activeIndex + i + artistImages.length) % artistImages.length;
      visible.push({ idx, offset: i });
    }
    return visible;
  };

  const visible = getVisible();
  const sizes = [140, 200, 300, 200, 140];

  return (
    <section className="artists-section" id="artists" style={{ position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }}>
        <div style={{ position: "absolute", top: "10%", left: "50%", width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle, rgba(139,0,0,.08) 0%, transparent 60%)", animation: "artist-bg1 20s ease-in-out infinite alternate", transform: "translateX(-50%)" }} />
        <div style={{ position: "absolute", bottom: "5%", left: "20%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(139,0,0,.06) 0%, transparent 70%)", animation: "artist-bg2 25s ease-in-out infinite alternate" }} />
      </div>

      <div style={{ textAlign: "center", marginBottom: 60, position: "relative", zIndex: 1 }}>
        <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".6em", textTransform: "uppercase", color: "var(--text3)", marginBottom: 16, display: "block" }}>Quem passa por aqui</span>
        <h2 className="artists-title" style={{ marginBottom: 0 }}>ARTISTAS</h2>
        <div style={{ width: 80, height: 1, background: "var(--primary-c)", margin: "24px auto 0" }} />
      </div>

      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 340, position: "relative", zIndex: 1 }}>
        {visible.map((item, i) => {
          const size = sizes[i];
          const isCenter = i === 2;
          return (
            <div key={`${item.idx}-${i}`} className="artist-circle" style={{ width: size, height: size, flexShrink: 0, marginLeft: i === 0 ? 0 : -30, zIndex: isCenter ? 10 : 5 - Math.abs(item.offset), transition: "all 0.8s cubic-bezier(.4,0,.2,1)", opacity: isCenter ? 1 : 0.6 }}>
              <img src={artistImages[item.idx]} alt={`Artist ${item.idx + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover", filter: isCenter ? "grayscale(0)" : "grayscale(1)", transition: "filter 0.8s" }} />
            </div>
          );
        })}
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 32, position: "relative", zIndex: 1 }}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} onClick={() => setActiveIndex(i)} style={{ width: activeIndex % 8 === i ? 20 : 6, height: 6, borderRadius: 3, background: activeIndex % 8 === i ? "var(--primary-c)" : "rgba(255,255,255,.15)", cursor: "pointer", transition: "all .3s" }} />
        ))}
      </div>

      <div className="artists-quote" style={{ marginTop: 48, position: "relative", zIndex: 1 }}>
        <div className="artists-quote-line" />
        <p>&ldquo;Cada voz que entra aqui sai com algo que não existia antes.&rdquo;</p>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `@keyframes artist-bg1{from{transform:translateX(-50%) scale(1);opacity:.6}to{transform:translateX(-50%) scale(1.2);opacity:1}}@keyframes artist-bg2{from{transform:translate(0,0) scale(1)}to{transform:translate(30px,-20px) scale(1.15)}}` }} />
    </section>
  );
}
