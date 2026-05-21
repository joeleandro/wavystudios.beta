'use client';

import * as React from "react";
import {
  DraggableContainer,
  GridBody,
  GridItem,
} from "@/components/site/draggable-gallery";

// ─── Images ──────────────────────────────────────────────────────────────────
const cycloImages = [
  "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=800&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1485579149621-3123dd979885?w=800&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=80",
  "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&q=80",
  "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80",
  "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&q=80",
  "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=800&q=80",
];

// ─── CycloSection ────────────────────────────────────────────────────────────
export function CycloSection() {
  return (
    <section style={{ background: "var(--bg)", color: "var(--text)" }}>
      <DraggableContainer variant="default">
        <GridBody>
          {cycloImages.map((src, i) => (
            <GridItem key={i}>
              <img
                src={src}
                alt=""
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                draggable={false}
              />
            </GridItem>
          ))}
        </GridBody>
      </DraggableContainer>
    </section>
  );
}
