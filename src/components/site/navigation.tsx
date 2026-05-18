"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LiquidMetalButton } from "@/components/ui/liquid-metal-button";

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`main-nav ${scrolled ? "scrolled" : ""}`}>
      {/* Logo image instead of "SG" text */}
      <Link href="/" style={{ display: "flex", alignItems: "center" }}>
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuD69aH4gDqvS6GPs2xSrAsH6uz0MUTCYqNe9923wUo4mY5swSnJVLBhwJFUuStaN2T_cN38aJLdPTrZk1_T0WjJhTQukQ3HpPrVj3G-OORLvLj4s-BJ0MnDFczT0XWDrJ9XV_HfRyB5mtCX493f9HOdOzasnAOtMQn6ZA54RKD9-WT6YTVWvKbv7sIS0Ws6QNdPuMBt6vS0zoh7ONM9u7bCFWpA-r3d4Q24kUhMWTLVcLfgzhm5iypCN_23yY9L4NP9DtnB0OJfJLa6"
          alt="Logo"
          style={{ width: 44, height: 44, objectFit: "contain", filter: "brightness(2)" }}
        />
      </Link>

      <div className="nav-links">
        <Link href="/" className="nav-link active-link">Início</Link>
        <a href="#pricing" className="nav-link">Serviços</a>
        <a href="#team" className="nav-link">Sobre</a>
        <a href="#artists" className="nav-link">Artistas</a>
      </div>

      {/* Liquid Metal Login button — no grid_view icon */}
      <div className="nav-right">
        <LiquidMetalButton label="Login" onClick={() => router.push("/login")} />
      </div>
    </nav>
  );
}
