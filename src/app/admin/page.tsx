"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { pt } from "date-fns/locale";

interface Stats {
  clientes_ativos: number;
  receita_mes: number;
  horas_mes: number;
  sessoes_hoje: number;
  sessoes_pendentes: number;
  ocupacao: number;
  sessoes_recentes: Array<{
    id: string;
    cliente_nome: string;
    tipo: string;
    data: string;
    hora_inicio: string;
    hora_fim: string;
    estado: string;
  }>;
}

interface Notificacao {
  id: string;
  mensagem: string;
  lida: number;
  criada_em: string;
}

export default function AdminDashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<Stats | null>(null);
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
  const [naoLidas, setNaoLidas] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    fetchStats();
    fetchNotificacoes();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  async function fetchStats() {
    const res = await fetch("/api/stats");
    if (res.ok) {
      const data = await res.json();
      setStats(data);
    }
  }

  async function fetchNotificacoes() {
    const res = await fetch("/api/notificacoes");
    if (res.ok) {
      const data = await res.json();
      setNotificacoes(data.notificacoes);
      setNaoLidas(data.nao_lidas);
    }
  }

  async function handleSessionAction(sessaoId: string, estado: string) {
    const res = await fetch("/api/sessoes", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessao_id: sessaoId, estado }),
    });
    if (res.ok) {
      fetchStats();
      fetchNotificacoes();
    }
  }

  const userName = session?.user?.name || "Admin";

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-label-opacity text-xs mb-1">
            <span className="material-symbols-outlined text-sm">home</span>
            <span className="text-white/20">/</span>
            <span>Dashboard</span>
          </div>
          <h1 className="text-2xl font-semibold text-headline">Overview</h1>
          <p className="text-sm text-label-opacity mt-0.5">
            Monitorizar métricas e gerir a plataforma
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <div className="relative">
            <button className="w-10 h-10 glass-card rounded-xl flex items-center justify-center text-white/60 hover:text-white transition-colors">
              <span className="material-symbols-outlined text-xl">notifications</span>
              {naoLidas > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-container rounded-full text-[9px] font-bold text-white flex items-center justify-center">
                  {naoLidas}
                </span>
              )}
            </button>
          </div>
          <div className="glass-card rounded-xl px-4 py-2 flex items-center gap-3">
            <div className="w-8 h-8 bg-primary-container/20 rounded-lg flex items-center justify-center">
              <span className="text-primary text-xs font-bold">
                {userName.split(" ").map(n => n[0]).join("")}
              </span>
            </div>
            <span className="text-sm font-medium">{userName}</span>
          </div>
        </div>
      </div>

      {/* Grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Welcome card */}
          <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-primary-container/5 rounded-full blur-[60px]" />
            <div className="relative z-10 flex justify-between items-start">
              <div>
                <h2 className="text-xl font-light text-headline">
                  Olá, {userName.split(" ")[0]}
                </h2>
                <p className="text-sm text-label-opacity mt-1">
                  Pronto para gerir o estúdio hoje
                </p>
                <div className="mt-4 font-[var(--font-display)] text-5xl text-headline tracking-wide">
                  {format(currentTime, "HH:mm")}
                  <span className="text-lg text-label-opacity ml-2 font-sans font-light">
                    {format(currentTime, "aa").toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-label-opacity">
                  {format(currentTime, "EEEE, d 'de' MMMM", { locale: pt })}
                </p>
              </div>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              icon="group"
              label="Clientes Ativos"
              value={stats?.clientes_ativos?.toString() || "0"}
              trend="+1"
            />
            <StatCard
              icon="schedule"
              label="Horas este Mês"
              value={`${stats?.horas_mes || 0}h`}
              trend=""
            />
            <StatCard
              icon="event_available"
              label="Sessões Hoje"
              value={stats?.sessoes_hoje?.toString() || "0"}
              trend=""
            />
            <StatCard
              icon="trending_up"
              label="Ocupação"
              value={`${stats?.ocupacao || 0}%`}
              trend="+5%"
            />
          </div>

          {/* Pending sessions */}
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-medium text-headline">Sessões Pendentes</h3>
                <p className="text-xs text-label-opacity mt-0.5">
                  {stats?.sessoes_pendentes || 0} aguardam confirmação
                </p>
              </div>
              <span className="material-symbols-outlined text-primary">pending_actions</span>
            </div>
            
            <div className="space-y-3">
              {stats?.sessoes_recentes
                ?.filter(s => s.estado === "pendente")
                .map((sessao) => (
                  <div key={sessao.id} className="flex items-center justify-between p-4 bg-surface-container/50 rounded-xl border border-white/5 hover:border-primary-container/20 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary-container/10 rounded-lg flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary text-sm">mic</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-headline">{sessao.cliente_nome}</p>
                        <p className="text-xs text-label-opacity">
                          {sessao.tipo} • {sessao.data} • {sessao.hora_inicio}–{sessao.hora_fim}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleSessionAction(sessao.id, "confirmada")}
                        className="w-8 h-8 bg-green-900/20 hover:bg-green-900/40 text-green-400 rounded-lg flex items-center justify-center transition-colors"
                      >
                        <span className="material-symbols-outlined text-sm">check</span>
                      </button>
                      <button
                        onClick={() => handleSessionAction(sessao.id, "cancelada")}
                        className="w-8 h-8 bg-error-container/10 hover:bg-error-container/20 text-error rounded-lg flex items-center justify-center transition-colors"
                      >
                        <span className="material-symbols-outlined text-sm">close</span>
                      </button>
                    </div>
                  </div>
                ))}
              
              {(!stats?.sessoes_recentes || stats.sessoes_recentes.filter(s => s.estado === "pendente").length === 0) && (
                <p className="text-center text-label-opacity text-sm py-8">
                  Nenhuma sessão pendente
                </p>
              )}
            </div>
          </div>

          {/* All recent sessions */}
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-medium text-headline">Sessões Recentes</h3>
                <p className="text-xs text-label-opacity mt-0.5">Últimas sessões agendadas</p>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-[10px] uppercase tracking-[0.15em] text-label-opacity">
                    <th className="text-left py-3 px-2">Cliente</th>
                    <th className="text-left py-3 px-2">Tipo</th>
                    <th className="text-left py-3 px-2">Data</th>
                    <th className="text-left py-3 px-2">Horário</th>
                    <th className="text-left py-3 px-2">Estado</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {stats?.sessoes_recentes?.map((sessao) => (
                    <tr key={sessao.id} className="border-t border-white/5">
                      <td className="py-3 px-2 text-headline">{sessao.cliente_nome}</td>
                      <td className="py-3 px-2 text-label-opacity capitalize">{sessao.tipo.replace("_", "/")}</td>
                      <td className="py-3 px-2 text-label-opacity">{sessao.data}</td>
                      <td className="py-3 px-2 text-label-opacity">{sessao.hora_inicio}–{sessao.hora_fim}</td>
                      <td className="py-3 px-2">
                        <SessionBadge estado={sessao.estado} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right column — Insights */}
        <div className="space-y-6">
          {/* Revenue */}
          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-lg font-medium text-headline mb-1">Receita Mensal</h3>
            <p className="text-xs text-label-opacity mb-6">Clientes ativos × plano</p>
            <div className="text-center">
              <span className="font-[var(--font-display)] text-5xl text-headline">
                €{stats?.receita_mes || 0}
              </span>
              <p className="text-xs text-label-opacity mt-2">
                {stats?.clientes_ativos || 0} clientes ativos
              </p>
            </div>
          </div>

          {/* Insights donut */}
          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-lg font-medium text-headline mb-1">Performance</h3>
            <p className="text-xs text-label-opacity mb-6">Métricas do estúdio</p>
            
            {/* Visual metrics */}
            <div className="flex justify-center mb-8">
              <div className="relative w-40 h-40">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                  <circle 
                    cx="50" cy="50" r="40" fill="none" 
                    stroke="#8b0000" strokeWidth="8"
                    strokeDasharray={`${(stats?.ocupacao || 0) * 2.51} 251`}
                    strokeLinecap="round"
                  />
                  <circle cx="50" cy="50" r="30" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
                  <circle 
                    cx="50" cy="50" r="30" fill="none" 
                    stroke="#ffb4a8" strokeWidth="6"
                    strokeDasharray={`${Math.min(100, ((stats?.horas_mes || 0) / 50) * 100) * 1.88} 188`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-headline">{stats?.ocupacao || 0}%</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <MetricRow color="bg-primary-container" label="Ocupação" sublabel="Taxa do estúdio" value={`${stats?.ocupacao || 0}%`} />
              <MetricRow color="bg-primary" label="Horas Trabalhadas" sublabel="Este mês" value={`${stats?.horas_mes || 0}h`} />
              <MetricRow color="bg-secondary" label="Sessões Pendentes" sublabel="Aguardam ação" value={`${stats?.sessoes_pendentes || 0}`} />
            </div>
          </div>

          {/* Notifications */}
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-headline">Notificações</h3>
              {naoLidas > 0 && (
                <span className="text-[10px] bg-primary-container/20 text-primary px-2 py-0.5 rounded-full">
                  {naoLidas} novas
                </span>
              )}
            </div>
            <div className="space-y-3 max-h-64 overflow-y-auto no-scrollbar">
              {notificacoes.map((n) => (
                <div key={n.id} className={`p-3 rounded-lg border transition-colors ${
                  n.lida ? "border-white/5 bg-transparent" : "border-primary-container/20 bg-primary-container/5"
                }`}>
                  <p className="text-xs text-on-surface">{n.mensagem}</p>
                  <p className="text-[10px] text-label-opacity mt-1">
                    {new Date(n.criada_em).toLocaleString("pt-PT")}
                  </p>
                </div>
              ))}
              {notificacoes.length === 0 && (
                <p className="text-center text-label-opacity text-sm py-4">Sem notificações</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, trend }: { icon: string; label: string; value: string; trend: string }) {
  return (
    <div className="glass-card rounded-xl p-4 group hover:burgundy-glow transition-all">
      <div className="flex items-center gap-2 mb-3">
        <span className="material-symbols-outlined text-sm text-white/40">{icon}</span>
        <span className="text-[10px] text-label-opacity uppercase tracking-wider">{label}</span>
      </div>
      <div className="flex items-end justify-between">
        <span className="text-2xl font-semibold text-headline">{value}</span>
        {trend && (
          <span className="text-[10px] text-green-400 flex items-center gap-0.5">
            <span className="material-symbols-outlined text-xs">trending_up</span>
            {trend}
          </span>
        )}
      </div>
    </div>
  );
}

function MetricRow({ color, label, sublabel, value }: { color: string; label: string; sublabel: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`w-3 h-3 rounded-full ${color}`} />
      <div className="flex-1">
        <p className="text-sm text-headline">{label}</p>
        <p className="text-[10px] text-label-opacity">{sublabel}</p>
      </div>
      <span className="text-sm font-medium text-headline">{value}</span>
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
    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${styles[estado] || ""}`}>
      {estado}
    </span>
  );
}
