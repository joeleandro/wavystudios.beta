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
      <svg className="wireframe-bg" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
        <path d="M500,0 L1000,500 L500,1000 L0,500 Z" fill="none" stroke="#8b0000" strokeWidth="0.6" />
        <circle cx="500" cy="500" r="450" fill="none" stroke="#8b0000" strokeDasharray="20 40" strokeWidth="0.3" />
        <path d="M200,200 L800,200 L800,800 L200,800 Z" fill="none" stroke="#8b0000" strokeWidth="0.4" transform="rotate(45 500 500)" />
      </svg>
    </>
  );
}
