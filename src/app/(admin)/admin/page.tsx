"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [sessoes, setSessoes] = useState<any[]>([]);
  const [notifs, setNotifs] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    // Clients count
    const { count: clientesAtivos } = await supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "cliente").eq("estado", "ativo");
    // Revenue
    const { data: activeClients } = await supabase.from("profiles").select("planos(preco_mensal)").eq("role", "cliente").eq("estado", "ativo");
    const receita = (activeClients || []).reduce((s: number, c: any) => s + (c.planos?.preco_mensal || 0), 0);
    // Pending sessions
    const { count: pendentes } = await supabase.from("sessoes").select("*", { count: "exact", head: true }).eq("estado", "pendente");
    // Recent sessions
    const { data: recentSess } = await supabase.from("sessoes").select("*, profiles(nome)").order("criado_em", { ascending: false }).limit(10);

    setStats({ clientes_ativos: clientesAtivos || 0, receita, pendentes: pendentes || 0 });
    setSessoes(recentSess || []);

    // Notifications
    const { data: n } = await supabase.from("notificacoes").select("*").eq("destinatario", "admin").order("criado_em", { ascending: false }).limit(5);
    setNotifs(n || []);
  }

  async function handleAction(sessaoId: string, estado: string) {
    await fetch("/api/sessoes", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sessao_id: sessaoId, estado }) });
    loadData();
  }

  return (
    <div style={{ maxWidth: 1400 }}>
      <div style={{ marginBottom: 26 }}>
        <div className="db-page-title bebas">Admin Dashboard</div>
        <div className="db-page-sub">Gestão do estúdio</div>
      </div>

      <div className="db-grid-4" style={{ marginBottom: 18 }}>
        <div className="db-card red-glow">
          <div className="db-card-label"><div className="dot" />Clientes ativos</div>
          <div className="db-stat-val">{stats?.clientes_ativos || 0}</div>
        </div>
        <div className="db-card red-glow">
          <div className="db-card-label"><div className="dot" />Receita/mês</div>
          <div className="db-stat-val">€{stats?.receita || 0}</div>
        </div>
        <div className="db-card red-glow">
          <div className="db-card-label"><div className="dot" />Pendentes</div>
          <div className="db-stat-val">{stats?.pendentes || 0}</div>
        </div>
        <div className="db-card red-glow">
          <div className="db-card-label"><div className="dot" />Notificações</div>
          <div className="db-stat-val">{notifs.length}</div>
        </div>
      </div>

      {/* Pending sessions */}
      <div className="db-card" style={{ marginBottom: 18 }}>
        <div className="db-card-label"><div className="dot" />Sessões pendentes</div>
        {sessoes.filter(s => s.estado === "pendente").length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {sessoes.filter(s => s.estado === "pendente").map(s => (
              <div key={s.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", background: "rgba(255,255,255,.02)", borderRadius: 10, border: "1px solid var(--border)" }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text)" }}>{s.profiles?.nome || "Cliente"}</div>
                  <div style={{ fontSize: 11, color: "var(--text3)" }}>{s.data} • {s.hora_inicio}–{s.hora_fim} • {s.tipo}</div>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <button onClick={() => handleAction(s.id, "confirmada")} style={{ width: 30, height: 30, background: "rgba(34,197,94,.1)", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(34,197,94,.2)", cursor: "pointer" }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 14, color: "#4ade80" }}>check</span>
                  </button>
                  <button onClick={() => handleAction(s.id, "recusada")} style={{ width: 30, height: 30, background: "rgba(239,68,68,.1)", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(239,68,68,.2)", cursor: "pointer" }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 14, color: "#f87171" }}>close</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : <div style={{ textAlign: "center", padding: "24px 0", color: "var(--text3)", fontSize: 12 }}>Nenhuma pendente</div>}
      </div>

      {/* Recent sessions table */}
      <div className="db-card">
        <div className="db-card-label"><div className="dot" />Sessões recentes</div>
        <table className="db-table">
          <thead><tr><th>Cliente</th><th>Data</th><th>Hora</th><th>Tipo</th><th>Estado</th></tr></thead>
          <tbody>
            {sessoes.map(s => (
              <tr key={s.id}>
                <td style={{ color: "var(--text)", fontWeight: 500 }}>{s.profiles?.nome || "—"}</td>
                <td>{s.data}</td>
                <td>{s.hora_inicio}–{s.hora_fim}</td>
                <td style={{ textTransform: "capitalize" }}>{s.tipo?.replace("_", "/")}</td>
                <td><span className={`status-pill ${s.estado === "confirmada" ? "sp-ok" : s.estado === "pendente" ? "sp-pend" : s.estado === "recusada" || s.estado === "cancelada" ? "sp-cancel" : "sp-done"}`}>{s.estado}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
