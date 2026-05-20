'use client';

import * as React from "react";
import {
  HTMLMotionProps,
  MotionValue,
  Variants,
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import { cn } from "@/lib/utils";

// ─── Types & config ──────────────────────────────────────────────────────────
interface ContainerScrollContextValue {
  scrollYProgress: MotionValue<number>;
}

const SPRING_CONFIG = {
  type: "spring",
  stiffness: 100,
  damping: 16,
  mass: 0.75,
  restDelta: 0.005,
  duration: 0.3,
};

const blurVariants: Variants = {
  hidden: { filter: "blur(10px)", opacity: 0 },
  visible: { filter: "blur(0px)", opacity: 1 },
};

// ─── Context ─────────────────────────────────────────────────────────────────
const ContainerScrollContext = React.createContext<ContainerScrollContextValue | undefined>(undefined);

function useContainerScrollContext() {
  const context = React.useContext(ContainerScrollContext);
  if (!context) throw new Error("useContainerScrollContext must be used within a ContainerScroll");
  return context;
}

// ─── ContainerScroll ─────────────────────────────────────────────────────────
const ContainerScroll = ({ children, className, style, ...props }: React.HtmlHTMLAttributes<HTMLDivElement>) => {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: scrollRef });
  return (
    <ContainerScrollContext.Provider value={{ scrollYProgress }}>
      <div
        ref={scrollRef}
        className={cn("relative min-h-[120vh]", className)}
        style={{ perspective: "1000px", perspectiveOrigin: "center top", transformStyle: "preserve-3d", ...style }}
        {...props}
      >
        {children}
      </div>
    </ContainerScrollContext.Provider>
  );
};

// ─── ContainerSticky ─────────────────────────────────────────────────────────
const ContainerSticky = ({ className, style, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("sticky left-0 top-0 min-h-[30rem] w-full overflow-hidden", className)}
    style={{ perspective: "1000px", perspectiveOrigin: "center top", transformStyle: "preserve-3d", transformOrigin: "50% 50%", ...style }}
    {...props}
  />
);

// ─── GalleryContainer ────────────────────────────────────────────────────────
const GalleryContainer = ({ children, className, style, ...props }: React.HTMLAttributes<HTMLDivElement> & HTMLMotionProps<"div">) => {
  const { scrollYProgress } = useContainerScrollContext();
  const rotateX = useTransform(scrollYProgress, [0, 0.5], [75, 0]);
  const scale = useTransform(scrollYProgress, [0.5, 0.9], [1.2, 1]);
  return (
    <motion.div
      className={cn("relative grid size-full grid-cols-3 gap-2 rounded-2xl", className)}
      style={{ rotateX, scale, transformStyle: "preserve-3d", perspective: "1000px", ...style }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// ─── GalleryCol ──────────────────────────────────────────────────────────────
const GalleryCol = ({ className, style, yRange = ["0%", "-10%"], ...props }: HTMLMotionProps<"div"> & { yRange?: string[] }) => {
  const { scrollYProgress } = useContainerScrollContext();
  const y = useTransform(scrollYProgress, [0.5, 1], yRange);
  return (
    <motion.div
      className={cn("relative flex w-full flex-col gap-2", className)}
      style={{ y, ...style }}
      {...props}
    />
  );
};

// ─── ContainerStagger ────────────────────────────────────────────────────────
const ContainerStagger = React.forwardRef<HTMLDivElement, HTMLMotionProps<"div">>(
  ({ className, viewport, transition, ...props }, ref) => (
    <motion.div
      className={cn("relative", className)}
      ref={ref}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, ...viewport }}
      transition={{ staggerChildren: transition?.staggerChildren || 0.2, ...transition }}
      {...props}
    />
  )
);
ContainerStagger.displayName = "ContainerStagger";

// ─── ContainerAnimated ───────────────────────────────────────────────────────
const ContainerAnimated = React.forwardRef<HTMLDivElement, HTMLMotionProps<"div">>(
  ({ className, transition, ...props }, ref) => (
    <motion.div
      ref={ref}
      className={cn(className)}
      variants={blurVariants}
      transition={SPRING_CONFIG}
      {...props}
    />
  )
);
ContainerAnimated.displayName = "ContainerAnimated";

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
];

function GalleryImg({ src, className }: { src: string; className?: string }) {
  return (
    <div className={cn("cyclo-img-wrap", className)}>
      <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </div>
  );
}

// ─── CycloSection ────────────────────────────────────────────────────────────
export function CycloSection() {
  return (
    <section style={{ background: "var(--bg)", color: "var(--text)" }}>

      {/* ── Hero header ── */}
      <div style={{ textAlign: "center", padding: "120px 24px 80px" }}>
        <ContainerStagger>
          <ContainerAnimated>
            <span className="section-eyebrow" style={{ display: "block", marginBottom: 16 }}>
              Espaço criativo
            </span>
          </ContainerAnimated>
          <ContainerAnimated>
            <h2 className="section-title bebas" style={{ letterSpacing: ".06em", lineHeight: 1, marginBottom: 36 }}>
              CYCLO
            </h2>
          </ContainerAnimated>
          <ContainerAnimated>
            <div style={{ maxWidth: 680, margin: "0 auto", display: "flex", flexDirection: "column", gap: 20 }}>
              <p style={{ fontSize: "clamp(15px, 1.6vw, 17px)", fontWeight: 300, color: "var(--text2)", lineHeight: 1.85 }}>
                A Cyclo é um espaço criativo multiusos concebido para dar vida a produções visuais modernas e experiências audiovisuais imersivas. Criada para fotógrafos, artistas, criadores de conteúdo e marcas, a Cyclo combina estética cinematográfica, versatilidade e tecnologia num ambiente pensado para transformar ideias em imagem.
              </p>
              <p style={{ fontSize: "clamp(15px, 1.6vw, 17px)", fontWeight: 300, color: "var(--text2)", lineHeight: 1.85 }}>
                Com uma cyclorama minimalista e setups adaptáveis, o espaço foi desenvolvido para fotografia, podcasts, videoclips, visualisers, campanhas editoriais e produções digitais contemporâneas. Cada detalhe — da iluminação ao ambiente — foi desenhado para oferecer liberdade criativa e uma identidade visual premium.
              </p>
              <p style={{ fontSize: "clamp(15px, 1.6vw, 17px)", fontWeight: 300, color: "var(--text2)", lineHeight: 1.85 }}>
                Mais do que um estúdio, a Cyclo representa uma nova geração de espaços criativos: dinâmicos, modernos e preparados para capturar o futuro da criação visual.
              </p>
              <p style={{ fontSize: "clamp(16px, 1.6vw, 18px)", fontWeight: 500, color: "var(--text)", fontStyle: "italic", lineHeight: 1.7, marginTop: 8 }}>
                "Capturing tomorrow's moments today."
              </p>
            </div>
          </ContainerAnimated>
        </ContainerStagger>
      </div>

      {/* ── 3D Gallery ── */}
      <ContainerScroll style={{ marginBottom: 120 }}>
        <ContainerSticky>
          <GalleryContainer>
            {/* Col 1 */}
            <GalleryCol yRange={["0%", "-8%"]}>
              <GalleryImg src={cycloImages[0]} className="cyclo-h-tall" />
              <GalleryImg src={cycloImages[1]} className="cyclo-h-mid" />
            </GalleryCol>
            {/* Col 2 — centre, slight upward drift */}
            <GalleryCol yRange={["0%", "-5%"]}>
              <GalleryImg src={cycloImages[2]} className="cyclo-h-mid" />
              <GalleryImg src={cycloImages[3]} className="cyclo-h-tall" />
              <GalleryImg src={cycloImages[4]} className="cyclo-h-short" />
            </GalleryCol>
            {/* Col 3 */}
            <GalleryCol yRange={["0%", "-12%"]}>
              <GalleryImg src={cycloImages[5]} className="cyclo-h-short" />
              <GalleryImg src={cycloImages[6]} className="cyclo-h-mid" />
              <GalleryImg src={cycloImages[7]} className="cyclo-h-tall" />
            </GalleryCol>
          </GalleryContainer>
        </ContainerSticky>
      </ContainerScroll>

      <style dangerouslySetInnerHTML={{ __html: `
        .cyclo-img-wrap {
          width: 100%; overflow: hidden; border-radius: 12px;
          border: 1px solid rgba(255,255,255,.06);
        }
        .cyclo-h-short { height: 160px; }
        .cyclo-h-mid   { height: 260px; }
        .cyclo-h-tall  { height: 360px; }

        @media (max-width: 768px) {
          .cyclo-h-short { height: 100px; }
          .cyclo-h-mid   { height: 160px; }
          .cyclo-h-tall  { height: 220px; }
        }
      `}} />
    </section>
  );
}
