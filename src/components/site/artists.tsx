"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

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

const TOTAL = artistImages.length;

export function ArtistsSection() {
  const [activeIndex, setActiveIndex] = useState(2);
  const [isDragging, setIsDragging] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Drag state
  const dragStartX = useRef(0);
  const dragDelta = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-advance
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % TOTAL);
    }, 3500);
    return () => clearInterval(interval);
  }, [isPaused]);

  const goNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % TOTAL);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 5000);
  }, []);

  const goPrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + TOTAL) % TOTAL);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 5000);
  }, []);

  const goTo = useCallback((i: number) => {
    setActiveIndex(i);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 5000);
  }, []);

  // Pointer drag handlers (works for mouse + touch)
  const onPointerDown = (e: React.PointerEvent) => {
    dragStartX.current = e.clientX;
    dragDelta.current = 0;
    setIsDragging(true);
    containerRef.current?.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    dragDelta.current = e.clientX - dragStartX.current;
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    const delta = e.clientX - dragStartX.current;
    if (Math.abs(delta) > 40) {
      delta < 0 ? goNext() : goPrev();
    }
    dragDelta.current = 0;
  };

  // Visible window: 5 items centered on activeIndex
  const visible = Array.from({ length: 5 }, (_, i) => {
    const offset = i - 2; // -2, -1, 0, 1, 2
    const idx = (activeIndex + offset + TOTAL) % TOTAL;
    return { idx, offset };
  });

  // Size + style per position
  const getStyle = (offset: number) => {
    const abs = Math.abs(offset);
    const size = abs === 0 ? 280 : abs === 1 ? 190 : 130;
    const opacity = abs === 0 ? 1 : abs === 1 ? 0.7 : 0.4;
    const zIndex = 10 - abs * 2;
    const scale = abs === 0 ? 1 : abs === 1 ? 0.92 : 0.84;
    return { size, opacity, zIndex, scale };
  };

  return (
    <section className="artists-section" id="artists">
      {/* Background radials */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }}>
        <div style={{ position: "absolute", top: "10%", left: "50%", width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle, rgba(139,0,0,.08) 0%, transparent 60%)", transform: "translateX(-50%)" }} />
      </div>

      {/* Title */}
      <div style={{ textAlign: "center", marginBottom: 48, position: "relative", zIndex: 1 }}>
        <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".6em", textTransform: "uppercase", color: "var(--text3)", display: "block", marginBottom: 16 }}>Quem passa por aqui</span>
        <h2 className="artists-title" style={{ marginBottom: 0 }}>ARTISTAS</h2>
        <div style={{ width: 80, height: 1, background: "var(--primary-c)", margin: "24px auto 0" }} />
      </div>

      {/* Carousel */}
      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Prev arrow */}
        <button
          onClick={goPrev}
          aria-label="Anterior"
          className="artist-arrow artist-arrow-left"
        >
          <ChevronLeft size={20} strokeWidth={2} />
        </button>

        {/* Track */}
        <div
          ref={containerRef}
          className="artist-track"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
          style={{ cursor: isDragging ? "grabbing" : "grab" }}
        >
          {visible.map((item, i) => {
            const { size, opacity, zIndex, scale } = getStyle(item.offset);
            const isCenter = item.offset === 0;
            return (
              <div
                key={`${item.idx}-${item.offset}`}
                onClick={() => !isDragging && goTo(item.idx)}
                className="artist-circle"
                style={{
                  width: size,
                  height: size,
                  flexShrink: 0,
                  opacity,
                  zIndex,
                  transform: `scale(${scale})`,
                  transition: "all 0.55s cubic-bezier(.4,0,.2,1)",
                  cursor: isCenter ? "default" : "pointer",
                  userSelect: "none",
                }}
              >
                <img
                  src={artistImages[item.idx]}
                  alt={`Artist ${item.idx + 1}`}
                  draggable={false}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    filter: isCenter ? "grayscale(0)" : "grayscale(1)",
                    transition: "filter 0.55s",
                    pointerEvents: "none",
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* Swipe hint (mobile) */}
        <p className="artist-swipe-hint">
          <span className="material-symbols-outlined" style={{ fontSize: 14, verticalAlign: "middle" }}>swipe</span>
          {" "}Arrasta para navegar
        </p>

        {/* Next arrow */}
        <button
          onClick={goNext}
          aria-label="Próximo"
          className="artist-arrow artist-arrow-right"
        >
          <ChevronRight size={20} strokeWidth={2} />
        </button>
      </div>

      {/* Dots */}
      <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 28, position: "relative", zIndex: 1 }}>
        {Array.from({ length: 8 }).map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Artista ${i + 1}`}
            style={{
              width: activeIndex % 8 === i ? 20 : 6,
              height: 6,
              borderRadius: 3,
              background: activeIndex % 8 === i ? "var(--primary-c)" : "rgba(255,255,255,.15)",
              cursor: "pointer",
              transition: "all .3s",
              border: "none",
              padding: 0,
            }}
          />
        ))}
      </div>

      {/* Quote */}
      <div className="artists-quote" style={{ marginTop: 48, position: "relative", zIndex: 1 }}>
        <div className="artists-quote-line" />
        <p>&ldquo;Cada voz que entra aqui sai com algo que não existia antes.&rdquo;</p>
      </div>
    </section>
  );
}
