"use client";

import { useRef, useEffect, useState } from "react";

interface Image {
  src: string;
  alt?: string;
}

interface ZoomParallaxProps {
  images: Image[];
}

/**
 * ZoomParallax — CSS-driven scroll zoom parallax (no framer-motion dependency).
 * Each image scales from 1× to 4–9× as the section scrolls through the viewport.
 */
export function ZoomParallax({ images }: ZoomParallaxProps) {
  const container = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0); // 0 → 1

  useEffect(() => {
    function onScroll() {
      const el = container.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      const scrolled = -rect.top;
      setProgress(Math.max(0, Math.min(1, scrolled / total)));
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const maxScales = [4, 5, 6, 5, 6, 8, 9];
  const positions = [
    // index 0: centre (default)
    undefined,
    // index 1
    { top: "-30vh", left: "5vw", height: "30vh", width: "35vw" },
    // index 2
    { top: "-10vh", left: "calc(50% - 25vw - 20vw)", height: "45vh", width: "20vw" },
    // index 3
    { top: "0", left: "calc(50% + 27.5vw)", height: "25vh", width: "25vw" },
    // index 4
    { top: "27.5vh", left: "5vw", height: "25vh", width: "20vw" },
    // index 5
    { top: "27.5vh", left: "calc(50% - 22.5vw - 15vw)", height: "25vh", width: "30vw" },
    // index 6
    { top: "22.5vh", left: "calc(50% + 25vw)", height: "15vh", width: "15vw" },
  ];

  return (
    <div ref={container} style={{ position: "relative", height: "300vh" }}>
      <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden" }}>
        {images.slice(0, 7).map(({ src, alt }, index) => {
          const maxScale = maxScales[index % maxScales.length];
          const scale = 1 + progress * (maxScale - 1);
          const pos = positions[index];

          return (
            <div
              key={index}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transform: `scale(${scale})`,
                transformOrigin: "center center",
                willChange: "transform",
              }}
            >
              <div
                style={
                  pos
                    ? {
                        position: "absolute",
                        top: pos.top,
                        left: pos.left,
                        height: pos.height,
                        width: pos.width,
                      }
                    : { position: "relative", height: "25vh", width: "25vw" }
                }
              >
                <img
                  src={src || "/placeholder.svg"}
                  alt={alt || `Parallax image ${index + 1}`}
                  style={{ height: "100%", width: "100%", objectFit: "cover" }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
