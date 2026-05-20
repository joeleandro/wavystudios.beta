'use client';

import { ZoomParallax } from './zoom-parallax';

const cycloImages = [
  { src: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=80&auto=format&fit=crop', alt: 'Studio recording' },
  { src: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&q=80&auto=format&fit=crop', alt: 'Music production' },
  { src: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80&auto=format&fit=crop', alt: 'Live performance' },
  { src: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&q=80&auto=format&fit=crop', alt: 'Mixing console' },
  { src: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=800&q=80&auto=format&fit=crop', alt: 'Microphone' },
  { src: 'https://images.unsplash.com/photo-1485579149621-3123dd979885?w=800&q=80&auto=format&fit=crop', alt: 'Headphones' },
  { src: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&q=80&auto=format&fit=crop', alt: 'Vinyl records' },
];

export function CycloSection() {
  return (
    <section className="cyclo-section">
      {/* Header */}
      <div className="cyclo-header">
        <span className="section-eyebrow">Portfolio</span>
        <h2 className="section-title bebas">CYCLO</h2>
        <p className="cyclo-desc">
          Uma viagem visual pelo universo Wavy Studios — sessões, artistas e momentos que definem o nosso som.
        </p>
      </div>

      {/* Zoom Parallax */}
      <ZoomParallax images={cycloImages} />

      <style dangerouslySetInnerHTML={{ __html: `
        .cyclo-section {
          position: relative;
          background: var(--bg);
        }
        .cyclo-header {
          text-align: center;
          padding: 120px 24px 60px;
        }
        .cyclo-desc {
          max-width: 480px;
          margin: 20px auto 0;
          font-size: 15px;
          font-weight: 300;
          color: var(--text2);
          line-height: 1.7;
        }
      `}} />
    </section>
  );
}
