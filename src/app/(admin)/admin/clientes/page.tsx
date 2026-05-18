"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function AdminClientesPage() {
  const [clientes, setClientes] = useState<any[]>([]);
  const [planos, setPlanos] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    const res = await fetch("/api/clientes");
    if (res.ok) { const d = await res.json(); setClientes(d.clientes || []); }
    const { data: p } = await supabase.from("planos").select("*").order("id");
    setPlanos(p || []);
  }

  async function ativarCliente(id: string, planoId: number) {
    await fetch("/api/clientes", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cliente_id: id, estado: "ativo", plano_id: planoId }),
    });
    loadData();
  }

  async function suspenderCliente(id: string) {
    await fetch("/api/clientes", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cliente_id: id, estado: "suspenso" }),
    });
    loadData();
  }

  return (
    <div style={{ maxWidth: 1200 }}>
      <div style={{ marginBottom: 26 }}>
        <div className="db-page-title bebas">Gestão de Clientes</div>
        <div className="db-page-sub">{clientes.length} clientes registados</div>
      </div>

      <div className="db-card">
        <table className="db-table">
          <thead><tr><th>Nome</th><th>Email</th><th>Telefone</th><th>Plano</th><th>Estado</th><th>Ações</th></tr></thead>
          <tbody>
            {clientes.map(c => (
              <tr key={c.id}>
                <td style={{ color: "var(--text)", fontWeight: 500 }}>{c.nome || "—"}</td>
                <td>{c.id?.slice(0, 8)}...</td>
                <td>{c.telefone || "—"}</td>
                <td style={{ color: "var(--primary)" }}>{c.planos?.nome || "Sem plano"}</td>
                <td><span className={`status-pill ${c.estado === "ativo" ? "sp-ok" : c.estado === "pendente" ? "sp-pend" : "sp-cancel"}`}>{c.estado}</span></td>
                <td>
                  {c.estado === "pendente" && (
                    <div style={{ display: "flex", gap: 4 }}>
                      {planos.map(p => (
                        <button key={p.id} onClick={() => ativarCliente(c.id, p.id)} style={{ fontSize: 9, padding: "4px 8px", background: "rgba(34,197,94,.1)", border: "1px solid rgba(34,197,94,.2)", borderRadius: 4, color: "#4ade80", cursor: "pointer" }}>
                          {p.nome}
                        </button>
                      ))}
                    </div>
                  )}
                  {c.estado === "ativo" && (
                    <button onClick={() => suspenderCliente(c.id)} style={{ fontSize: 9, padding: "4px 8px", background: "rgba(239,68,68,.1)", border: "1px solid rgba(239,68,68,.2)", borderRadius: 4, color: "#f87171", cursor: "pointer" }}>
                      Suspender
                    </button>
                  )}
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
