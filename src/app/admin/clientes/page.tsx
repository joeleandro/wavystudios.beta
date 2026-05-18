"use client";

import { useEffect, useState } from "react";

interface Cliente {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  estado: string;
  data_inicio: string;
  plano_nome: string;
  preco_mensal: number;
  horas_semanais: number;
}

interface Plano {
  id: string;
  nome: string;
}

export default function AdminClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    nome: "", email: "", telefone: "", plano_id: "", password: ""
  });
  const [error, setError] = useState("");

  useEffect(() => {
    fetchClientes();
  }, []);

  async function fetchClientes() {
    const res = await fetch("/api/clientes");
    if (res.ok) {
      const data = await res.json();
      setClientes(data.clientes);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/clientes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setShowForm(false);
      setForm({ nome: "", email: "", telefone: "", plano_id: "", password: "" });
      fetchClientes();
    } else {
      const data = await res.json();
      setError(data.error);
    }
  }

  return (
    <div className="max-w-[1200px] mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-headline">Clientes</h1>
          <p className="text-sm text-label-opacity mt-0.5">{clientes.length} clientes registados</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-primary-container hover:bg-primary-container/80 text-white px-5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-[0.15em] transition-all burgundy-glow"
        >
          <span className="material-symbols-outlined text-sm">person_add</span>
          Novo Cliente
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <form onSubmit={handleCreate} className="glass-card rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-semibold text-headline uppercase tracking-wider">Novo Cliente</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text" placeholder="Nome completo" value={form.nome}
              onChange={e => setForm({...form, nome: e.target.value})}
              className="bg-surface-container border border-white/5 rounded-lg px-4 py-2.5 text-sm text-on-surface placeholder:text-white/20 focus:outline-none focus:border-primary-container/50 transition-all"
              required
            />
            <input
              type="email" placeholder="Email" value={form.email}
              onChange={e => setForm({...form, email: e.target.value})}
              className="bg-surface-container border border-white/5 rounded-lg px-4 py-2.5 text-sm text-on-surface placeholder:text-white/20 focus:outline-none focus:border-primary-container/50 transition-all"
              required
            />
            <input
              type="tel" placeholder="Telefone (WhatsApp)" value={form.telefone}
              onChange={e => setForm({...form, telefone: e.target.value})}
              className="bg-surface-container border border-white/5 rounded-lg px-4 py-2.5 text-sm text-on-surface placeholder:text-white/20 focus:outline-none focus:border-primary-container/50 transition-all"
            />
            <select
              value={form.plano_id} onChange={e => setForm({...form, plano_id: e.target.value})}
              className="bg-surface-container border border-white/5 rounded-lg px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary-container/50 transition-all"
              required
            >
              <option value="">Selecionar plano</option>
              <option value="plan_standard">Standard – €150/mês</option>
              <option value="plan_professional">Professional – €190/mês</option>
              <option value="plan_avancado">Avançado – €250/mês</option>
            </select>
            <input
              type="password" placeholder="Password inicial" value={form.password}
              onChange={e => setForm({...form, password: e.target.value})}
              className="bg-surface-container border border-white/5 rounded-lg px-4 py-2.5 text-sm text-on-surface placeholder:text-white/20 focus:outline-none focus:border-primary-container/50 transition-all"
              required
            />
          </div>
          {error && <p className="text-error text-xs">{error}</p>}
          <div className="flex gap-3">
            <button type="submit" className="bg-primary-container text-white px-6 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all hover:bg-primary-container/80">
              Criar Cliente
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2.5 rounded-lg text-xs text-label-opacity border border-white/10 hover:text-white transition-all">
              Cancelar
            </button>
          </div>
        </form>
      )}

      {/* Clients table */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface-container/50">
              <tr className="text-[10px] uppercase tracking-[0.15em] text-label-opacity">
                <th className="text-left py-4 px-6">Nome</th>
                <th className="text-left py-4 px-4">Email</th>
                <th className="text-left py-4 px-4">Plano</th>
                <th className="text-left py-4 px-4">Horas/Semana</th>
                <th className="text-left py-4 px-4">Início</th>
                <th className="text-left py-4 px-4">Estado</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {clientes.map((c) => (
                <tr key={c.id} className="border-t border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary-container/10 rounded-lg flex items-center justify-center text-primary text-xs font-bold">
                        {c.nome.split(" ").map(n => n[0]).join("")}
                      </div>
                      <span className="text-headline font-medium">{c.nome}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-label-opacity">{c.email}</td>
                  <td className="py-4 px-4">
                    <span className="text-primary text-xs font-medium">{c.plano_nome || "—"}</span>
                  </td>
                  <td className="py-4 px-4 text-label-opacity">{c.horas_semanais || 0}h</td>
                  <td className="py-4 px-4 text-label-opacity">{c.data_inicio || "—"}</td>
                  <td className="py-4 px-4">
                    <span className={`text-[10px] px-2.5 py-1 rounded-full border ${
                      c.estado === "ativo"
                        ? "bg-green-900/20 text-green-400 border-green-900/30"
                        : "bg-red-900/20 text-red-400 border-red-900/30"
                    }`}>
                      {c.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
