"use client";

import { useEffect, useState } from "react";

interface Sessao {
  id: string;
  tipo: string;
  data: string;
  hora_inicio: string;
  hora_fim: string;
  duracao_minutos: number;
  estado: string;
}

export default function ClienteSessoesPage() {
  const [sessoes, setSessoes] = useState<Sessao[]>([]);
  const [filter, setFilter] = useState<string>("todas");

  useEffect(() => { fetchSessoes(); }, []);

  async function fetchSessoes() {
    const res = await fetch("/api/sessoes");
    if (res.ok) {
      const data = await res.json();
      setSessoes(data.sessoes || []);
    }
  }

  async function handleCancel(id: string) {
    if (!confirm("Tem certeza? Sessões canceladas não podem ser remarcadas.")) return;
    const res = await fetch("/api/sessoes", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessao_id: id, estado: "cancelada" }),
    });
    if (res.ok) fetchSessoes();
  }

  const filtered = filter === "todas" ? sessoes : sessoes.filter(s => s.estado === filter);

  const filters = ["todas", "pendente", "confirmada", "concluida", "cancelada"];

  return (
    <div style={{ maxWidth: 1000 }}>
      <div style={{ marginBottom: 26 }}>
        <div className="db-page-title bebas">Minhas Sessões</div>
        <div className="db-page-sub">Histórico de todas as sessões</div>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              fontSize: 10, fontWeight: 600, letterSpacing: ".15em", textTransform: "uppercase",
              padding: "8px 16px", borderRadius: 8, cursor: "pointer", transition: "all .2s",
              background: filter === f ? "rgba(139,0,0,.15)" : "transparent",
              border: filter === f ? "1px solid rgba(139,0,0,.3)" : "1px solid var(--border)",
              color: filter === f ? "var(--primary)" : "var(--text3)",
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Sessions list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {filtered.map(sessao => (
          <div key={sessao.id} className="db-card" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 38, height: 38, background: "rgba(139,0,0,.1)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span className="material-symbols-outlined" style={{ fontSize: 16, color: "var(--primary)" }}>
                  {sessao.tipo === "captacao" ? "mic" : sessao.tipo === "mix_master" ? "tune" : sessao.tipo === "foto" ? "photo_camera" : "music_note"}
                </span>
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text)", textTransform: "capitalize" }}>{sessao.tipo.replace("_", "/")}</div>
                <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 2 }}>{sessao.data} &bull; {sessao.hora_inicio} – {sessao.hora_fim} &bull; {sessao.duracao_minutos}min</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span className={`status-pill ${
                sessao.estado === "pendente" ? "sp-pend" :
                sessao.estado === "confirmada" ? "sp-ok" :
                sessao.estado === "cancelada" ? "sp-cancel" : "sp-done"
              }`}>{sessao.estado}</span>
              {(sessao.estado === "pendente" || sessao.estado === "confirmada") && (
                <button
                  onClick={() => handleCancel(sessao.id)}
                  style={{ fontSize: 10, padding: "6px 12px", background: "rgba(239,68,68,.08)", border: "1px solid rgba(239,68,68,.2)", borderRadius: 6, color: "#f87171", cursor: "pointer", transition: "all .2s" }}
                >
                  Cancelar
                </button>
              )}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "48px 0" }}>
            <span className="material-symbols-outlined" style={{ fontSize: 36, color: "rgba(255,255,255,.1)", display: "block", marginBottom: 12 }}>event_busy</span>
            <div style={{ fontSize: 13, color: "var(--text3)" }}>Nenhuma sessão encontrada</div>
          </div>
        )}
      </div>
    </div>
  );
}
