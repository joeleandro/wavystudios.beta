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
      {/* ── Text content ── */}
      <div className="cyclo-text-section">
        <span className="section-eyebrow" style={{ display: "block", marginBottom: 16 }}>
          Espaço criativo
        </span>
        <h2 className="section-title bebas" style={{ letterSpacing: ".06em", lineHeight: 1, marginBottom: 36 }}>
          CYCLO
        </h2>
        <div className="cyclo-text-content">
          <p>
            A Cyclo é um espaço criativo multiusos concebido para dar vida a produções visuais modernas e experiências audiovisuais imersivas. Criada para fotógrafos, artistas, criadores de conteúdo e marcas, a Cyclo combina estética cinematográfica, versatilidade e tecnologia num ambiente pensado para transformar ideias em imagem.
          </p>
          <p>
            Com uma cyclorama minimalista e setups adaptáveis, o espaço foi desenvolvido para fotografia, podcasts, videoclips, visualisers, campanhas editoriais e produções digitais contemporâneas. Cada detalhe — da iluminação ao ambiente — foi desenhado para oferecer liberdade criativa e uma identidade visual premium.
          </p>
          <p>
            Mais do que um estúdio, a Cyclo representa uma nova geração de espaços criativos: dinâmicos, modernos e preparados para capturar o futuro da criação visual.
          </p>
          <p className="cyclo-quote">
            &ldquo;Capturing tomorrow&apos;s moments today.&rdquo;
          </p>
        </div>
      </div>

      {/* ── Gallery (desktop: draggable grid, mobile: scrollable grid) ── */}
      <div className="cyclo-gallery-desktop">
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
      </div>

      {/* Mobile gallery — simple scrollable grid */}
      <div className="cyclo-gallery-mobile">
        {cycloImages.map((src, i) => (
          <div key={i} className="cyclo-mobile-card">
            <img
              src={src}
              alt=""
              style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 12 }}
            />
          </div>
        ))}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .cyclo-text-section {
          text-align: center;
          padding: 120px 24px 80px;
        }
        .cyclo-text-content {
          max-width: 680px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .cyclo-text-content p {
          font-size: clamp(15px, 1.6vw, 17px);
          font-weight: 300;
          color: var(--text2);
          line-height: 1.85;
        }
        .cyclo-quote {
          font-size: clamp(16px, 1.6vw, 18px) !important;
          font-weight: 500 !important;
          color: var(--text) !important;
          font-style: italic;
          line-height: 1.7;
          margin-top: 8px;
        }
        .cyclo-gallery-desktop {
          display: block;
        }
        .cyclo-gallery-mobile {
          display: none;
        }
        @media (max-width: 768px) {
          .cyclo-gallery-desktop {
            display: none;
          }
          .cyclo-gallery-mobile {
            display: grid;
            grid-template-columns: 1fr;
            gap: 12px;
            padding: 0 16px 80px;
          }
          .cyclo-mobile-card {
            width: 100%;
            height: 220px;
            border-radius: 12px;
            overflow: hidden;
          }
          .cyclo-text-section {
            padding: 80px 20px 40px;
          }
        }
      `}} />
    </section>
  );
}
