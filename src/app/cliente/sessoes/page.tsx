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

  useEffect(() => {
    fetchSessoes();
  }, []);

  async function fetchSessoes() {
    const res = await fetch("/api/sessoes");
    if (res.ok) {
      const data = await res.json();
      setSessoes(data.sessoes);
    }
  }

  async function handleCancel(id: string) {
    if (!confirm("Tem certeza que deseja cancelar esta sessão? Sessões canceladas não podem ser remarcadas.")) return;
    const res = await fetch("/api/sessoes", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessao_id: id, estado: "cancelada" }),
    });
    if (res.ok) fetchSessoes();
  }

  const filtered = filter === "todas" ? sessoes : sessoes.filter(s => s.estado === filter);

  return (
    <div className="max-w-[1000px] mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-headline">Minhas Sessões</h1>
        <p className="text-sm text-label-opacity mt-0.5">Histórico de todas as sessões</p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {["todas", "pendente", "confirmada", "concluida", "cancelada"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-[10px] uppercase tracking-[0.15em] px-4 py-2 rounded-lg border transition-all ${
              filter === f
                ? "bg-primary-container/20 border-primary-container/30 text-primary"
                : "border-white/5 text-label-opacity hover:text-white hover:border-white/20"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Sessions list */}
      <div className="space-y-3">
        {filtered.map(sessao => (
          <div key={sessao.id} className="glass-card rounded-xl p-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-primary-container/10 rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-sm">
                  {sessao.tipo === "captacao" ? "mic" : sessao.tipo === "mix_master" ? "tune" : sessao.tipo === "foto" ? "photo_camera" : "music_note"}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-headline capitalize">
                  {sessao.tipo.replace("_", "/")}
                </p>
                <p className="text-xs text-label-opacity mt-0.5">
                  {sessao.data} • {sessao.hora_inicio} – {sessao.hora_fim} • {sessao.duracao_minutos}min
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-[10px] px-2.5 py-1 rounded-full border ${
                sessao.estado === "pendente" ? "bg-yellow-900/20 text-yellow-400 border-yellow-900/30" :
                sessao.estado === "confirmada" ? "bg-green-900/20 text-green-400 border-green-900/30" :
                sessao.estado === "cancelada" ? "bg-red-900/20 text-red-400 border-red-900/30" :
                "bg-blue-900/20 text-blue-400 border-blue-900/30"
              }`}>
                {sessao.estado}
              </span>
              {(sessao.estado === "pendente" || sessao.estado === "confirmada") && (
                <button
                  onClick={() => handleCancel(sessao.id)}
                  className="text-[10px] px-3 py-1.5 bg-error-container/10 text-error rounded-lg hover:bg-error-container/20 transition-colors"
                >
                  Cancelar
                </button>
              )}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-16">
            <span className="material-symbols-outlined text-4xl text-white/10 mb-4 block">event_busy</span>
            <p className="text-sm text-label-opacity">Nenhuma sessão encontrada</p>
          </div>
        )}
      </div>
    </div>
  );
}
