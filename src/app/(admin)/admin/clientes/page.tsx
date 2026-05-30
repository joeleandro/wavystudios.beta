"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

function formatDate(d?: string | null) {
  if (!d) return "—";
  return new Date(d + "T12:00:00").toLocaleDateString("pt-PT", { day: "numeric", month: "short", year: "numeric" });
}

export default function AdminClientesPage() {
  const [clientes, setClientes] = useState<any[]>([]);
  const [planos, setPlanos] = useState<any[]>([]);
  const [busy, setBusy] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    const res = await fetch("/api/clientes");
    if (res.ok) { const d = await res.json(); setClientes(d.clientes || []); }
    const { data: p } = await supabase.from("planos").select("*").order("id");
    setPlanos(p || []);
  }

  async function patch(payload: any, key: string) {
    setBusy(key);
    await fetch("/api/clientes", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    await loadData();
    setBusy(null);
  }

  async function mudarPlano(id: string, planoId: number, estadoAtual: string) {
    // If client is pending, changing plan also activates them
    const estado = estadoAtual === "pendente" ? "ativo" : undefined;
    await patch({ cliente_id: id, plano_id: planoId, ...(estado ? { estado } : {}) }, `plano-${id}`);
  }

  async function renovar(id: string) {
    await patch({ cliente_id: id, renovar: true }, `renovar-${id}`);
  }

  async function suspenderCliente(id: string) {
    await patch({ cliente_id: id, estado: "suspenso" }, `susp-${id}`);
  }

  async function ativarCliente(id: string) {
    await patch({ cliente_id: id, estado: "ativo" }, `ativ-${id}`);
  }

  return (
    <div style={{ maxWidth: 1200 }}>
      <div style={{ marginBottom: 26 }}>
        <div className="db-page-title bebas">Gestão de Clientes</div>
        <div className="db-page-sub">{clientes.length} clientes registados</div>
      </div>

      <div className="db-card" style={{ overflowX: "auto" }}>
        <table className="db-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Telefone</th>
              <th>Plano</th>
              <th>Estado</th>
              <th>Renovação</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map(c => (
              <tr key={c.id}>
                <td style={{ color: "var(--text)", fontWeight: 500 }}>{c.nome || "—"}</td>
                <td>{c.telefone || "—"}</td>
                <td>
                  {/* Plan dropdown — change anytime */}
                  <select
                    value={c.plano_id || ""}
                    onChange={(e) => mudarPlano(c.id, Number(e.target.value), c.estado)}
                    disabled={busy === `plano-${c.id}`}
                    style={{
                      fontSize: 11, padding: "5px 8px", borderRadius: 6,
                      background: "rgba(255,255,255,.04)", border: "1px solid var(--border)",
                      color: c.plano_id ? "var(--primary)" : "var(--text3)", cursor: "pointer", maxWidth: 150,
                    }}
                  >
                    <option value="">Sem plano</option>
                    {planos.map(p => (
                      <option key={p.id} value={p.id}>{p.nome}</option>
                    ))}
                  </select>
                </td>
                <td>
                  <span className={`status-pill ${c.estado === "ativo" ? "sp-ok" : c.estado === "pendente" ? "sp-pend" : "sp-cancel"}`}>{c.estado}</span>
                </td>
                <td style={{ fontSize: 11, color: c.data_renovacao ? "var(--text2)" : "var(--text3)" }}>
                  {formatDate(c.data_renovacao)}
                </td>
                <td>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {/* Renovar — available for any client with a plan */}
                    {c.plano_id && (
                      <button
                        onClick={() => renovar(c.id)}
                        disabled={busy === `renovar-${c.id}`}
                        style={{ fontSize: 9, padding: "5px 10px", background: "rgba(139,0,0,.12)", border: "1px solid rgba(139,0,0,.3)", borderRadius: 4, color: "var(--primary)", cursor: "pointer", fontWeight: 600, letterSpacing: ".05em", textTransform: "uppercase" }}
                      >
                        {busy === `renovar-${c.id}` ? "..." : "↻ Renovar"}
                      </button>
                    )}
                    {c.estado === "pendente" && (
                      <button
                        onClick={() => ativarCliente(c.id)}
                        disabled={busy === `ativ-${c.id}`}
                        style={{ fontSize: 9, padding: "5px 10px", background: "rgba(34,197,94,.1)", border: "1px solid rgba(34,197,94,.2)", borderRadius: 4, color: "#4ade80", cursor: "pointer", fontWeight: 600, letterSpacing: ".05em", textTransform: "uppercase" }}
                      >
                        Ativar
                      </button>
                    )}
                    {c.estado === "ativo" && (
                      <button
                        onClick={() => suspenderCliente(c.id)}
                        disabled={busy === `susp-${c.id}`}
                        style={{ fontSize: 9, padding: "5px 10px", background: "rgba(239,68,68,.1)", border: "1px solid rgba(239,68,68,.2)", borderRadius: 4, color: "#f87171", cursor: "pointer", fontWeight: 600, letterSpacing: ".05em", textTransform: "uppercase" }}
                      >
                        Suspender
                      </button>
                    )}
                    {c.estado === "suspenso" && (
                      <button
                        onClick={() => ativarCliente(c.id)}
                        disabled={busy === `ativ-${c.id}`}
                        style={{ fontSize: 9, padding: "5px 10px", background: "rgba(34,197,94,.1)", border: "1px solid rgba(34,197,94,.2)", borderRadius: 4, color: "#4ade80", cursor: "pointer", fontWeight: 600, letterSpacing: ".05em", textTransform: "uppercase" }}
                      >
                        Reativar
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {clientes.length === 0 && <div style={{ textAlign: "center", padding: "32px 0", color: "var(--text3)", fontSize: 12 }}>Sem clientes</div>}
      </div>
    </div>
  );
}
