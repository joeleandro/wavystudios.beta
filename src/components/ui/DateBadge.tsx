"use client";

type DateBadgeSize = "sm" | "md" | "lg";

const sizes = {
  sm: { wrap: "6px 10px", weekday: "9px", day: "18px", month: "13px", year: "10px", minW: "100px" },
  md: { wrap: "8px 14px", weekday: "10px", day: "26px", month: "15px", year: "11px", minW: "120px" },
  lg: { wrap: "12px 18px", weekday: "11px", day: "36px", month: "18px", year: "12px", minW: "140px" },
};

export function DateBadge({ date, size = "md" }: { date: string | Date; size?: DateBadgeSize }) {
  const d = typeof date === "string" ? new Date(date + (date.length === 10 ? "T12:00:00" : "")) : date;

  const diaSemana = d
    .toLocaleDateString("pt-PT", { weekday: "long" })
    .replace(/^\w/, (c) => c.toUpperCase());

  const dia = d.toLocaleDateString("pt-PT", { day: "numeric" });

  const mes = d
    .toLocaleDateString("pt-PT", { month: "long" })
    .replace(/^\w/, (c) => c.toUpperCase());

  const ano = d.getFullYear();
  const s = sizes[size];

  return (
    <div
      style={{
        background: "rgba(139, 0, 0, 0.15)",
        border: "1px solid rgba(192, 57, 43, 0.35)",
        borderRadius: "10px",
        display: "inline-flex",
        flexDirection: "column",
        gap: "1px",
        padding: s.wrap,
        minWidth: s.minW,
      }}
    >
      <span
        style={{
          fontSize: s.weekday,
          letterSpacing: "2px",
          textTransform: "uppercase",
          color: "#C0392B",
          fontWeight: 600,
        }}
      >
        {diaSemana}
      </span>
      <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
        <span
          style={{
            fontSize: s.day,
            fontWeight: 700,
            color: "#ffffff",
            lineHeight: 1,
            fontFamily: "Bebas Neue, sans-serif",
          }}
        >
          {dia}
        </span>
        <span
          style={{
            fontSize: s.month,
            fontWeight: 600,
            color: "rgba(255,255,255,0.85)",
          }}
        >
          {mes}
        </span>
      </div>
      <span
        style={{
          fontSize: s.year,
          color: "rgba(255,255,255,0.35)",
          letterSpacing: "1px",
        }}
      >
        {ano}
      </span>
    </div>
  );
}
