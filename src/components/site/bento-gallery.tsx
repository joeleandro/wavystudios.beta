"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { behanceProjects, type BehanceProject } from "@/config/behance-projects";

// ─── Types ────────────────────────────────────────────────────────────────────

type ImageItem = {
  id: number | string;
  title: string;
  desc: string;
  url: string;
  behanceUrl: string;
  span: string;
};

// ─── Fallback gradient SVG ────────────────────────────────────────────────────

const FALLBACK = (id: number) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600">
      <defs>
        <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#3d0000"/>
          <stop offset="100%" stop-color="#050505"/>
        </linearGradient>
      </defs>
      <rect width="800" height="600" fill="url(#g)"/>
      <text x="50%" y="52%" text-anchor="middle" dominant-baseline="middle"
        font-family="Bebas Neue,sans-serif" font-size="72"
        fill="rgba(255,180,168,0.15)">${id}</text>
    </svg>`
  )}`;

// ─── Single card ──────────────────────────────────────────────────────────────

function BehanceCard({
  item,
  onOpen,
}: {
  item: BehanceProject;
  onOpen: (resolved: ImageItem) => void;
}) {
  const [imgUrl, setImgUrl] = useState<string>(FALLBACK(item.id));
  const [imgLoaded, setImgLoaded] = useState(false);
  const [visible, setVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Intersection observer → fade-in-up on enter
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Fetch OG image from server API
  useEffect(() => {
    let cancelled = false;
    fetch(`/api/behance-preview?url=${encodeURIComponent(item.url)}`)
      .then((r) => r.json())
      .then((d) => { if (!cancelled && d.image) setImgUrl(d.image); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [item.url]);

  const resolved: ImageItem = {
    id: item.id,
    title: item.title,
    desc: item.desc,
    url: imgUrl,
    behanceUrl: item.url,
    span: item.span,
  };

  return (
    <div
      ref={cardRef}
      role="button"
      tabIndex={0}
      aria-label={`Ver ${item.title}`}
      onClick={() => onOpen(resolved)}
      onKeyDown={(e) => e.key === "Enter" && onOpen(resolved)}
      className={cn("bento-card", item.span)}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0) scale(1)" : "translateY(20px) scale(0.97)",
        transition: "opacity .55s ease, transform .55s ease",
      }}
    >
      {/* Shimmer */}
      {!imgLoaded && <div className="bento-shimmer" />}

      {/* Image */}
      <img
        src={imgUrl}
        alt={item.title}
        onLoad={() => setImgLoaded(true)}
        className="bento-img"
        style={{ opacity: imgLoaded ? 1 : 0 }}
      />

      {/* Hover overlay */}
      <div className="bento-overlay" />

      {/* Text */}
      <div className="bento-text">
        <h3 className="bento-title">{item.title}</h3>
        <p className="bento-desc">{item.desc}</p>
      </div>

      {/* Behance badge */}
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        className="bento-badge"
      >
        Behance ↗
      </a>
    </div>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────

function ImageModal({
  item,
  onClose,
}: {
  item: ImageItem;
  onClose: () => void;
}) {
  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <div className="bento-modal-backdrop" onClick={onClose}>
      <div
        className="bento-modal-inner"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={item.url}
          alt={item.title}
          className="bento-modal-img"
        />
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: "#fff" }}>{item.title}</h3>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,.55)", marginTop: 4 }}>{item.desc}</p>
          <a
            href={item.behanceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bento-behance-link"
          >
            Ver no Behance ↗
          </a>
        </div>
      </div>

      <button
        onClick={onClose}
        className="bento-close-btn"
        aria-label="Fechar"
      >
        <X size={20} />
      </button>
    </div>
  );
}

// ─── Main Gallery ─────────────────────────────────────────────────────────────

export function BentoGallery() {
  const [selectedItem, setSelectedItem] = useState<ImageItem | null>(null);
  const [dragConstraint, setDragConstraint] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement & { _baseX?: number }>(null);
  const dragState = useRef({ startX: 0, currentX: 0, active: false });

  // Calculate drag constraint
  useEffect(() => {
    function calc() {
      if (gridRef.current && containerRef.current) {
        const diff = containerRef.current.offsetWidth - gridRef.current.scrollWidth - 32;
        setDragConstraint(Math.min(0, diff));
      }
    }
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);

  // Custom drag handlers
  const onPointerDown = useCallback((e: React.PointerEvent) => {
    dragState.current = { startX: e.clientX, currentX: 0, active: true };
    setIsDragging(false);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragState.current.active) return;
    const delta = e.clientX - dragState.current.startX;
    if (Math.abs(delta) > 5) setIsDragging(true);
    dragState.current.currentX = delta;
    if (gridRef.current) {
      const raw = (gridRef.current as any)._baseX || 0;
      const clamped = Math.max(dragConstraint, Math.min(0, raw + delta));
      gridRef.current.style.transform = `translateX(${clamped}px)`;
    }
  }, [dragConstraint]);

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    if (!dragState.current.active) return;
    dragState.current.active = false;
    if (gridRef.current) {
      const match = gridRef.current.style.transform.match(/translateX\((-?\d+\.?\d*)px\)/);
      const cur = match ? parseFloat(match[1]) : 0;
      (gridRef.current as any)._baseX = cur;
    }
    setTimeout(() => setIsDragging(false), 50);
  }, []);

  return (
    <section
      style={{ position: "relative", width: "100%", overflow: "hidden", background: "var(--bg)", padding: "80px 0 100px" }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", padding: "0 24px 56px" }}>
        <span className="section-eyebrow" style={{ display: "block", marginBottom: 16 }}>
          Portfolio
        </span>
        <h2 className="section-title bebas" style={{ letterSpacing: ".04em", lineHeight: 1 }}>
          ARTISTAS
        </h2>
        <p style={{ maxWidth: 480, margin: "20px auto 0", fontSize: 15, fontWeight: 300, color: "var(--text2)", lineHeight: 1.7 }}>
          Arrasta para explorar os projectos. Clica para ver em detalhe.
        </p>
      </div>

      {/* Draggable row */}
      <div
        ref={containerRef}
        style={{ width: "100%", cursor: isDragging ? "grabbing" : "grab", userSelect: "none" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        <div
          ref={gridRef}
          style={{ display: "grid", gridAutoFlow: "column", gridAutoColumns: "minmax(16rem,1fr)", gap: 16, padding: "0 24px 8px", width: "max-content", transition: isDragging ? "none" : "transform .1s ease" }}
        >
          {behanceProjects.map((item) => (
            <BehanceCard
              key={item.id}
              item={item}
              onOpen={(resolved) => { if (!isDragging) setSelectedItem(resolved); }}
            />
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedItem && (
        <ImageModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}

      {/* Styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        .bento-card {
          position: relative;
          display: flex;
          align-items: flex-end;
          min-height: 15rem;
          width: 100%;
          min-width: 15rem;
          overflow: hidden;
          border-radius: 14px;
          border: 1px solid rgba(255,255,255,.07);
          background: #0e0e0e;
          padding: 16px;
          cursor: pointer;
        }
        .bento-card:hover .bento-overlay { opacity: 1; }
        .bento-card:hover .bento-text { opacity: 1; transform: translateY(0); }
        .bento-card:hover .bento-img { transform: scale(1.05); }
        .bento-card:hover .bento-badge { opacity: 1; }
        .bento-card:focus-visible { outline: 2px solid #8b0000; outline-offset: 2px; }

        .bento-img {
          position: absolute; inset: 0; width: 100%; height: 100%;
          object-fit: cover; transition: transform .7s ease, opacity .5s ease;
        }
        .bento-shimmer {
          position: absolute; inset: 0;
          background: linear-gradient(135deg, #1c1b1b 0%, #0e0e0e 50%, #161515 100%);
          overflow: hidden;
        }
        .bento-shimmer::after {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255,180,168,.05), transparent);
          animation: bento-shimmer 1.8s ease-in-out infinite;
        }
        @keyframes bento-shimmer {
          from { transform: translateX(-100%); }
          to   { transform: translateX(100%); }
        }
        .bento-overlay {
          position: absolute; inset: 0; pointer-events: none;
          background: linear-gradient(to top, rgba(0,0,0,.9) 0%, rgba(0,0,0,.35) 50%, transparent 100%);
          opacity: 0; transition: opacity .45s ease;
        }
        .bento-text {
          position: relative; z-index: 2;
          opacity: 0; transform: translateY(12px);
          transition: opacity .45s ease, transform .45s ease;
        }
        .bento-title { font-size: 15px; font-weight: 700; color: #fff; line-height: 1.3; }
        .bento-desc  { font-size: 12px; color: rgba(255,255,255,.7); margin-top: 3px; }
        .bento-badge {
          position: absolute; right: 12px; top: 12px; z-index: 3;
          padding: 3px 10px; border-radius: 999px;
          background: rgba(0,0,0,.5); backdrop-filter: blur(6px);
          font-size: 9px; font-weight: 600; letter-spacing: .15em;
          text-transform: uppercase; color: rgba(255,255,255,.45);
          opacity: 0; transition: opacity .3s, color .2s;
          text-decoration: none;
        }
        .bento-badge:hover { color: #fff; }

        .bento-modal-backdrop {
          position: fixed; inset: 0; z-index: 9999;
          background: rgba(0,0,0,.88); backdrop-filter: blur(16px);
          display: flex; align-items: center; justify-content: center;
          animation: bento-modal-in .25s ease;
          padding: 16px;
        }
        @keyframes bento-modal-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .bento-modal-inner {
          width: 100%; max-width: 900px;
          animation: bento-modal-scale .3s cubic-bezier(.4,0,.2,1);
        }
        @keyframes bento-modal-scale {
          from { transform: scale(.9) translateY(20px); opacity: 0; }
          to   { transform: scale(1) translateY(0); opacity: 1; }
        }
        .bento-modal-img {
          max-height: 75vh; width: 100%;
          object-fit: contain; border-radius: 16px;
          box-shadow: 0 24px 80px rgba(0,0,0,.6);
        }
        .bento-behance-link {
          display: inline-flex; align-items: center; gap: 6px;
          margin-top: 14px; padding: 8px 20px;
          border-radius: 999px; border: 1px solid rgba(255,255,255,.12);
          font-size: 11px; font-weight: 600; letter-spacing: .15em;
          text-transform: uppercase; color: rgba(255,255,255,.6);
          text-decoration: none; transition: border-color .2s, color .2s;
        }
        .bento-behance-link:hover { border-color: #C0392B; color: #fff; }

        .bento-close-btn {
          position: fixed; right: 20px; top: 20px;
          background: rgba(255,255,255,.1); backdrop-filter: blur(8px);
          border: none; border-radius: 50%; width: 40px; height: 40px;
          display: flex; align-items: center; justify-content: center;
          color: rgba(255,255,255,.7); cursor: pointer;
          transition: background .2s, color .2s;
        }
        .bento-close-btn:hover { background: rgba(255,255,255,.2); color: #fff; }
      `}} />
    </section>
  );
}
