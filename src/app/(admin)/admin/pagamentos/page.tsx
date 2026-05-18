"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function AdminPagamentosPage() {
  const [pagamentos, setPagamentos] = useState<any[]>([]);
  const [clientes, setClientes] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ cliente_id: "", valor: "", metodo: "mbway", referencia: "", notas: "" });
  const supabase = createClient();

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    const { data: p } = await supabase.from("pagamentos").select("*, profiles(nome)").order("criado_em", { ascending: false });
    setPagamentos(p || []);
    const { data: c } = await supabase.from("profiles").select("id, nome").eq("role", "cliente");
    setClientes(c || []);
  }

  async function registarPagamento(e: React.FormEvent) {
    e.preventDefault();
    await supabase.from("pagamentos").insert({
      cliente_id: form.cliente_id,
      valor: parseFloat(form.valor),
      metodo: form.metodo,
      referencia: form.referencia || null,
      notas: form.notas || null,
      mes_referente: new Date().toISOString().slice(0, 10),
      confirmado: true,
      confirmado_em: new Date().toISOString(),
    });
    setShowForm(false);
    setForm({ cliente_id: "", valor: "", metodo: "mbway", referencia: "", notas: "" });
    loadData();
  }

  return (
    <div style={{ maxWidth: 1200 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 26 }}>
        <div>
          <div className="db-page-title bebas">Pagamentos</div>
          <div className="db-page-sub">{pagamentos.length} registos</div>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="marcar-cta" style={{ width: "auto", marginTop: 0, padding: "10px 20px", fontSize: 10 }}>
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>add</span>Registar
        </button>
      </div>

      {showForm && (
        <form onSubmit={registarPagamento} className="db-card" style={{ marginBottom: 18 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label className="login-label">Cliente</label>
              <select className="login-input" value={form.cliente_id} onChange={e => setForm({ ...form, cliente_id: e.target.value })} required>
                <option value="">Selecionar</option>
                {clientes.map(c => <option key={c.id} value={c.id}>{c.nome || c.id.slice(0, 8)}</option>)}
              </select>
            </div>
            <div>
              <label className="login-label">Valor (€)</label>
              <input className="login-input" type="number" step="0.01" value={form.valor} onChange={e => setForm({ ...form, valor: e.target.value })} required />
            </div>
            <div>
              <label className="login-label">Método</label>
              <select className="login-input" value={form.metodo} onChange={e => setForm({ ...form, metodo: e.target.value })}>
                <option value="mbway">MB Way</option>
                <option value="transferencia">Transferência</option>
                <option value="dinheiro">Dinheiro</option>
                <option value="outro">Outro</option>
              </select>
            </div>
            <div>
              <label className="login-label">Referência</label>
              <input className="login-input" value={form.referencia} onChange={e => setForm({ ...form, referencia: e.target.value })} placeholder="Opcional" />
            </div>
          </div>
          <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
            <button type="submit" className="marcar-cta" style={{ width: "auto", marginTop: 0, padding: "10px 20px" }}>Registar</button>
            <button type="button" onClick={() => setShowForm(false)} style={{ padding: "10px 20px", border: "1px solid var(--border)", borderRadius: 10, color: "var(--text3)", fontSize: 11, cursor: "pointer" }}>Cancelar</button>
          </div>
        </form>
      )}

      <div className="db-card">
        <table className="db-table">
          <thead><tr><th>Cliente</th><th>Valor</th><th>Método</th><th>Data</th><th>Estado</th></tr></thead>
          <tbody>
            {pagamentos.map(p => (
              <tr key={p.id}>
                <td style={{ color: "var(--text)", fontWeight: 500 }}>{p.profiles?.nome || "—"}</td>
                <td>€{p.valor}</td>
                <td style={{ textTransform: "capitalize" }}>{p.metodo}</td>
                <td>{p.criado_em?.split("T")[0]}</td>
                <td><span className={`status-pill ${p.confirmado ? "sp-ok" : "sp-pend"}`}>{p.confirmado ? "Confirmado" : "Pendente"}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
        {pagamentos.length === 0 && <div style={{ textAlign: "center", padding: "32px 0", color: "var(--text3)", fontSize: 12 }}>Sem pagamentos registados</div>}
      </div>
    </div>
  );
}
