"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";

interface WeeklyStatus {
  semana_inicio: string;
  horas_plano: number;
  horas_usadas: number;
  horas_restantes: number;
  plano_nome: string;
  duracao_sessao: number;
}

interface ProximaSessao {
  id: string;
  tipo: string;
  data: string;
  hora_inicio: string;
  hora_fim: string;
  estado: string;
}

interface ClienteStats {
  weekly: WeeklyStatus | null;
  proxima_sessao: ProximaSessao | null;
  total_sessoes_concluidas: number;
}

export default function ClienteDashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<ClienteStats | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    const res = await fetch("/api/stats");
    if (res.ok) {
      const data = await res.json();
      setStats(data);
    }
  }

  const userName = session?.user?.name || "Cliente";
  const weekly = stats?.weekly;
  const progress = weekly ? (weekly.horas_usadas / weekly.horas_plano) * 100 : 0;

  return (
    <div className="max-w-[1000px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-headline">Olá, {userName.split(" ")[0]}</h1>
          <p className="text-sm text-label-opacity mt-0.5">
            Plano {weekly?.plano_nome || "—"} • Sessões de {weekly?.duracao_sessao || 0}min
          </p>
        </div>
        <Link
          href="/cliente/marcar"
          className="flex items-center gap-2 bg-primary-container hover:bg-primary-container/80 text-white px-5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-[0.15em] transition-all burgundy-glow"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          Marcar Sessão
        </Link>
      </div>

      {/* Weekly hours card */}
      <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-primary-container/5 rounded-full blur-[60px]" />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-medium text-headline">Horas da Semana</h3>
              <p className="text-xs text-label-opacity mt-0.5">
                Semana de {weekly?.semana_inicio || "—"}
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-[var(--font-display)] text-headline">
                {weekly?.horas_restantes.toFixed(1) || 0}h
              </p>
              <p className="text-[10px] text-label-opacity uppercase tracking-wider">restantes</p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden mb-3">
            <div 
              className="h-full bg-gradient-to-r from-primary-container to-primary rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, progress)}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-label-opacity uppercase tracking-wider">
            <span>{weekly?.horas_usadas.toFixed(1) || 0}h usadas</span>
            <span>{weekly?.horas_plano || 0}h total</span>
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-sm text-primary">event</span>
            <span className="text-[10px] text-label-opacity uppercase tracking-wider">Próxima Sessão</span>
          </div>
          {stats?.proxima_sessao ? (
            <div>
              <p className="text-sm text-headline font-medium">
                {stats.proxima_sessao.data}
              </p>
              <p className="text-xs text-label-opacity mt-1">
                {stats.proxima_sessao.hora_inicio} – {stats.proxima_sessao.hora_fim}
              </p>
              <span className={`inline-block mt-2 text-[9px] px-2 py-0.5 rounded-full ${
                stats.proxima_sessao.estado === "confirmada" 
                  ? "bg-green-900/20 text-green-400" 
                  : "bg-yellow-900/20 text-yellow-400"
              }`}>
                {stats.proxima_sessao.estado}
              </span>
            </div>
          ) : (
            <p className="text-sm text-label-opacity">Nenhuma sessão agendada</p>
          )}
        </div>

        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-sm text-primary">check_circle</span>
            <span className="text-[10px] text-label-opacity uppercase tracking-wider">Concluídas</span>
          </div>
          <p className="text-3xl font-[var(--font-display)] text-headline">
            {stats?.total_sessoes_concluidas || 0}
          </p>
          <p className="text-[10px] text-label-opacity mt-1">sessões totais</p>
        </div>

        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-sm text-primary">timer</span>
            <span className="text-[10px] text-label-opacity uppercase tracking-wider">Duração</span>
          </div>
          <p className="text-3xl font-[var(--font-display)] text-headline">
            {weekly?.duracao_sessao || 0}<span className="text-sm text-label-opacity ml-1">min</span>
          </p>
          <p className="text-[10px] text-label-opacity mt-1">por sessão</p>
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 gap-4">
        <Link href="/cliente/sessoes" className="glass-card rounded-xl p-5 group hover:burgundy-glow transition-all">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-container/10 rounded-lg flex items-center justify-center group-hover:bg-primary-container/20 transition-colors">
              <span className="material-symbols-outlined text-primary">calendar_month</span>
            </div>
            <div>
              <p className="text-sm font-medium text-headline">Minhas Sessões</p>
              <p className="text-[10px] text-label-opacity">Ver histórico completo</p>
            </div>
          </div>
        </Link>
        <Link href="/cliente/marcar" className="glass-card rounded-xl p-5 group hover:burgundy-glow transition-all">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-container/10 rounded-lg flex items-center justify-center group-hover:bg-primary-container/20 transition-colors">
              <span className="material-symbols-outlined text-primary">add_circle</span>
            </div>
            <div>
              <p className="text-sm font-medium text-headline">Marcar Sessão</p>
              <p className="text-[10px] text-label-opacity">Agendar nova sessão</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
