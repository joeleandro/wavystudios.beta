"use client";

import { liquidMetalFragmentShader, ShaderMount } from "@paper-design/shaders";
import { useEffect, useMemo, useRef, useState } from "react";

interface LiquidMetalButtonProps {
  label?: string;
  onClick?: () => void;
  viewMode?: "text" | "icon";
}

export function LiquidMetalButton({
  label = "Login",
  onClick,
  viewMode = "text",
}: LiquidMetalButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const shaderRef = useRef<HTMLDivElement>(null);
  const shaderMount = useRef<any>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const dimensions = useMemo(() => {
    if (viewMode === "icon") {
      return { width: 46, height: 46, innerWidth: 42, innerHeight: 42, shaderWidth: 46, shaderHeight: 46 };
    }
    return { width: 120, height: 42, innerWidth: 116, innerHeight: 38, shaderWidth: 120, shaderHeight: 42 };
  }, [viewMode]);

  useEffect(() => {
    const styleId = "shader-canvas-style";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = `.shader-container-lm canvas { width: 100% !important; height: 100% !important; display: block !important; position: absolute !important; top: 0 !important; left: 0 !important; border-radius: 100px !important; }`;
      document.head.appendChild(style);
    }

    const loadShader = async () => {
      try {
        if (shaderRef.current) {
          if (shaderMount.current?.destroy) shaderMount.current.destroy();
          shaderMount.current = new ShaderMount(shaderRef.current, liquidMetalFragmentShader, {
            u_repetition: 4, u_softness: 0.5, u_shiftRed: 0.3, u_shiftBlue: 0.3,
            u_distortion: 0, u_contour: 0, u_angle: 45, u_scale: 8, u_shape: 1,
            u_offsetX: 0.1, u_offsetY: -0.1,
          }, undefined, 0.6);
        }
      } catch (error) {
        console.error("[Shader] Failed:", error);
      }
    };
    loadShader();
    return () => { if (shaderMount.current?.destroy) { shaderMount.current.destroy(); shaderMount.current = null; } };
  }, []);

  const handleMouseEnter = () => { setIsHovered(true); shaderMount.current?.setSpeed?.(1); };
  const handleMouseLeave = () => { setIsHovered(false); setIsPressed(false); shaderMount.current?.setSpeed?.(0.6); };

  const handleClick = () => {
    if (shaderMount.current?.setSpeed) {
      shaderMount.current.setSpeed(2.4);
      setTimeout(() => { shaderMount.current?.setSpeed?.(isHovered ? 1 : 0.6); }, 300);
    }
    onClick?.();
  };

  return (
    <div className="relative inline-block" style={{ perspective: "1000px" }}>
      <div style={{ position: "relative", width: dimensions.width, height: dimensions.height, transformStyle: "preserve-3d" }}>
        {/* Text layer */}
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", transform: "translateZ(20px)", zIndex: 30, pointerEvents: "none" }}>
          <span style={{ fontSize: 11, color: "#888", fontWeight: 600, letterSpacing: ".18em", textTransform: "uppercase", textShadow: "0px 1px 2px rgba(0,0,0,0.5)" }}>{label}</span>
        </div>
        {/* Dark inner */}
        <div style={{ position: "absolute", inset: 0, transform: `translateZ(10px) ${isPressed ? "translateY(1px) scale(0.98)" : ""}`, zIndex: 20, transition: "all .3s" }}>
          <div style={{ width: dimensions.innerWidth, height: dimensions.innerHeight, margin: 2, borderRadius: 100, background: "linear-gradient(180deg, #202020 0%, #000 100%)", boxShadow: isPressed ? "inset 0 2px 4px rgba(0,0,0,.4)" : "none" }} />
        </div>
        {/* Shader layer */}
        <div style={{ position: "absolute", inset: 0, transform: `translateZ(0) ${isPressed ? "translateY(1px) scale(0.98)" : ""}`, zIndex: 10, transition: "all .3s" }}>
          <div style={{ width: dimensions.width, height: dimensions.height, borderRadius: 100, boxShadow: isHovered ? "0 0 0 1px rgba(0,0,0,.4), 0 8px 5px rgba(0,0,0,.1)" : "0 0 0 1px rgba(0,0,0,.3), 0 20px 12px rgba(0,0,0,.08), 0 9px 9px rgba(0,0,0,.12)", transition: "box-shadow .3s" }}>
            <div ref={shaderRef} className="shader-container-lm" style={{ borderRadius: 100, overflow: "hidden", position: "relative", width: dimensions.shaderWidth, height: dimensions.shaderHeight }} />
          </div>
        </div>
        {/* Clickable */}
        <button ref={buttonRef} onClick={handleClick} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onMouseDown={() => setIsPressed(true)} onMouseUp={() => setIsPressed(false)} style={{ position: "absolute", inset: 0, background: "transparent", border: "none", cursor: "pointer", outline: "none", zIndex: 40, borderRadius: 100, transform: "translateZ(25px)" }} aria-label={label} />
      </div>
    </div>
  );
}
