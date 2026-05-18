"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function AdminSessoesPage() {
  const [sessoes, setSessoes] = useState<any[]>([]);
  const [filter, setFilter] = useState("todas");
  const supabase = createClient();

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    const { data } = await supabase.from("sessoes").select("*, profiles(nome)").order("data", { ascending: false }).order("hora_inicio");
    setSessoes(data || []);
  }

  async function handleAction(id: string, estado: string) {
    await fetch("/api/sessoes", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sessao_id: id, estado }) });
    loadData();
  }

  const filtered = filter === "todas" ? sessoes : sessoes.filter(s => s.estado === filter);
  const filters = ["todas", "pendente", "confirmada", "concluida", "recusada", "cancelada"];

  return (
    <div style={{ maxWidth: 1200 }}>
      <div style={{ marginBottom: 26 }}>
        <div className="db-page-title bebas">Gestão de Sessões</div>
        <div className="db-page-sub">{sessoes.length} sessões totais</div>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {filters.map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".15em", textTransform: "uppercase", padding: "8px 16px", borderRadius: 8, cursor: "pointer", background: filter === f ? "rgba(139,0,0,.15)" : "transparent", border: filter === f ? "1px solid rgba(139,0,0,.3)" : "1px solid var(--border)", color: filter === f ? "var(--primary)" : "var(--text3)", transition: "all .2s" }}>
            {f}
          </button>
        ))}
      </div>

      <div className="db-card">
        <table className="db-table">
          <thead><tr><th>Cliente</th><th>Data</th><th>Hora</th><th>Tipo</th><th>Duração</th><th>Estado</th><th>Ações</th></tr></thead>
          <tbody>
            {filtered.map(s => (
              <tr key={s.id}>
                <td style={{ color: "var(--text)", fontWeight: 500 }}>{s.profiles?.nome || "—"}</td>
                <td>{s.data}</td>
                <td>{s.hora_inicio}–{s.hora_fim}</td>
                <td style={{ textTransform: "capitalize" }}>{s.tipo?.replace("_", "/")}</td>
                <td>{s.duracao_minutos}min</td>
                <td><span className={`status-pill ${s.estado === "confirmada" ? "sp-ok" : s.estado === "pendente" ? "sp-pend" : s.estado === "recusada" || s.estado === "cancelada" ? "sp-cancel" : "sp-done"}`}>{s.estado}</span></td>
                <td>
                  {s.estado === "pendente" && (
                    <div style={{ display: "flex", gap: 4 }}>
                      <button onClick={() => handleAction(s.id, "confirmada")} style={{ fontSize: 9, padding: "4px 10px", background: "rgba(34,197,94,.1)", border: "1px solid rgba(34,197,94,.2)", borderRadius: 4, color: "#4ade80", cursor: "pointer" }}>Confirmar</button>
                      <button onClick={() => handleAction(s.id, "recusada")} style={{ fontSize: 9, padding: "4px 10px", background: "rgba(239,68,68,.1)", border: "1px solid rgba(239,68,68,.2)", borderRadius: 4, color: "#f87171", cursor: "pointer" }}>Recusar</button>
                    </div>
                  )}
                  {s.estado === "confirmada" && (
                    <button onClick={() => handleAction(s.id, "concluida")} style={{ fontSize: 9, padding: "4px 10px", background: "rgba(59,130,246,.1)", border: "1px solid rgba(59,130,246,.2)", borderRadius: 4, color: "#60a5fa", cursor: "pointer" }}>Concluir</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div style={{ textAlign: "center", padding: "32px 0", color: "var(--text3)", fontSize: 12 }}>Sem sessões</div>}
      </div>
    </div>
  );
}
