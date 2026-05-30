"use client";

export function DateBadge({ date }: { date: string | Date }) {
  const d = typeof date === "string" ? new Date(date + (date.length === 10 ? "T12:00:00" : "")) : date;

  const diaSemana = d
    .toLocaleDateString("pt-PT", { weekday: "long" })
    .replace(/^\w/, (c) => c.toUpperCase());

  const diaMes = d
    .toLocaleDateString("pt-PT", { day: "numeric", month: "long" })
    .replace(/ de /g, " ")
    .replace(/^\w/, (c) => c.toUpperCase());

  const ano = d.getFullYear();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <span
        style={{
          fontSize: "10px",
          letterSpacing: "2px",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.45)",
          fontWeight: 600,
        }}
      >
        {diaSemana}
      </span>
      <span
        style={{
          fontSize: "22px",
          fontWeight: 700,
          color: "#ffffff",
          lineHeight: 1.1,
        }}
      >
        {diaMes}
      </span>
      <span
        style={{
          fontSize: "11px",
          color: "rgba(255,255,255,0.35)",
        }}
      >
        {ano}
      </span>
    </div>
  );
}
