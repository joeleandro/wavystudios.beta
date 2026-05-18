"use client";

import { useEffect, useState } from "react";

interface Sessao {
  id: string;
  cliente_nome: string;
  tipo: string;
  data: string;
  hora_inicio: string;
  hora_fim: string;
  duracao_minutos: number;
  estado: string;
}

export default function AdminSessoesPage() {
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

  async function handleAction(id: string, estado: string) {
    const res = await fetch("/api/sessoes", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessao_id: id, estado }),
    });
    if (res.ok) fetchSessoes();
  }

  const filtered = filter === "todas" 
    ? sessoes 
    : sessoes.filter(s => s.estado === filter);

  return (
    <div className="max-w-[1200px] mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-headline">Sessões</h1>
          <p className="text-sm text-label-opacity mt-0.5">Gestão completa de sessões</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
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

      {/* Table */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface-container/50">
              <tr className="text-[10px] uppercase tracking-[0.15em] text-label-opacity">
                <th className="text-left py-4 px-6">Cliente</th>
                <th className="text-left py-4 px-4">Tipo</th>
                <th className="text-left py-4 px-4">Data</th>
                <th className="text-left py-4 px-4">Horário</th>
                <th className="text-left py-4 px-4">Duração</th>
                <th className="text-left py-4 px-4">Estado</th>
                <th className="text-right py-4 px-6">Ações</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filtered.map((sessao) => (
                <tr key={sessao.id} className="border-t border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-6">
                    <span className="text-headline font-medium">{sessao.cliente_nome}</span>
                  </td>
                  <td className="py-4 px-4 text-label-opacity capitalize">{sessao.tipo.replace("_", "/")}</td>
                  <td className="py-4 px-4 text-label-opacity">{sessao.data}</td>
                  <td className="py-4 px-4 text-label-opacity">{sessao.hora_inicio} – {sessao.hora_fim}</td>
                  <td className="py-4 px-4 text-label-opacity">{sessao.duracao_minutos}min</td>
                  <td className="py-4 px-4">
                    <SessionBadge estado={sessao.estado} />
                  </td>
                  <td className="py-4 px-6 text-right">
                    {sessao.estado === "pendente" && (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleAction(sessao.id, "confirmada")}
                          className="text-[10px] px-3 py-1.5 bg-green-900/20 text-green-400 rounded-lg hover:bg-green-900/40 transition-colors"
                        >
                          Confirmar
                        </button>
                        <button
                          onClick={() => handleAction(sessao.id, "cancelada")}
                          className="text-[10px] px-3 py-1.5 bg-error-container/10 text-error rounded-lg hover:bg-error-container/20 transition-colors"
                        >
                          Cancelar
                        </button>
                      </div>
                    )}
                    {sessao.estado === "confirmada" && (
                      <button
                        onClick={() => handleAction(sessao.id, "concluida")}
                        className="text-[10px] px-3 py-1.5 bg-blue-900/20 text-blue-400 rounded-lg hover:bg-blue-900/40 transition-colors"
                      >
                        Concluir
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <p className="text-center text-label-opacity text-sm py-12">Nenhuma sessão encontrada</p>
        )}
      </div>
    </div>
  );
}

function SessionBadge({ estado }: { estado: string }) {
  const styles: Record<string, string> = {
    pendente: "bg-yellow-900/20 text-yellow-400 border-yellow-900/30",
    confirmada: "bg-green-900/20 text-green-400 border-green-900/30",
    cancelada: "bg-red-900/20 text-red-400 border-red-900/30",
    concluida: "bg-blue-900/20 text-blue-400 border-blue-900/30",
  };
  return (
    <span className={`text-[10px] px-2.5 py-1 rounded-full border ${styles[estado] || ""}`}>
      {estado}
    </span>
  );
}
