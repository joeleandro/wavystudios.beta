"use client";

import { useEffect } from "react";

export function GlobalEffects() {
  useEffect(() => {
    const glow = document.getElementById("cursorGlow");
    const handleMouseMove = (e: MouseEvent) => {
      if (glow) {
        glow.style.left = e.clientX + "px";
        glow.style.top = e.clientY + "px";
      }
    };
    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <>
      <div className="film-grain" />
      <div className="cursor-glow" id="cursorGlow" />
      {/* Prism-based wireframe background — visual rhyming with logo */}
      <svg className="wireframe-bg" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
        {/* Central prism trio (echoes logo) */}
        <polygon points="400,700 500,300 600,700" fill="none" stroke="#8b0000" strokeWidth="0.4" />
        <polygon points="320,700 450,250 580,700" fill="none" stroke="#8b0000" strokeWidth="0.3" opacity="0.6" />
        <polygon points="480,700 550,350 620,700" fill="none" stroke="#8b0000" strokeWidth="0.3" opacity="0.6" />
        {/* Outer geometric frame */}
        <path d="M500,50 L950,500 L500,950 L50,500 Z" fill="none" stroke="#8b0000" strokeWidth="0.4" />
        {/* Concentric prism rings */}
        <polygon points="350,750 500,200 650,750" fill="none" stroke="#8b0000" strokeWidth="0.2" strokeDasharray="12 24" opacity="0.4" />
        <polygon points="250,800 500,100 750,800" fill="none" stroke="#8b0000" strokeWidth="0.2" strokeDasharray="8 32" opacity="0.25" />
        {/* Sound wave arcs */}
        <path d="M 300 600 Q 500 450 700 600" fill="none" stroke="#8b0000" strokeWidth="0.3" opacity="0.35" />
        <path d="M 250 650 Q 500 400 750 650" fill="none" stroke="#8b0000" strokeWidth="0.2" opacity="0.25" />
      </svg>
    </>
  );
}
