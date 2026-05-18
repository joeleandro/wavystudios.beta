"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";

interface WeeklyStatus { horas_plano: number; horas_usadas: number; horas_restantes: number; plano_nome: string; duracao_sessao: number; }
interface ClienteStats { weekly: WeeklyStatus | null; proxima_sessao: { data: string; hora_inicio: string; hora_fim: string; estado: string } | null; total_sessoes_concluidas: number; }

export default function ClienteDashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<ClienteStats | null>(null);

  useEffect(() => { fetch("/api/stats").then(r => r.json()).then(setStats); }, []);

  const userName = session?.user?.name || "Cliente";
  const weekly = stats?.weekly;
  const pct = weekly ? Math.round((weekly.horas_usadas / weekly.horas_plano) * 100) : 0;

  return (
    <div style={{ maxWidth: 1200 }}>
      <div style={{ marginBottom: 26 }}>
        <div className="db-page-title bebas">Olá, {userName.split(" ")[0]}</div>
        <div className="db-page-sub">PLANO {weekly?.plano_nome?.toUpperCase() || "—"} ATIVO</div>
      </div>

      {/* 4 stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 18 }}>
        <div className="db-card red-glow">
          <div className="db-card-label"><div className="dot" />Horas restantes</div>
          <div className="db-stat-val">{weekly?.horas_restantes.toFixed(1) || 0}<span className="u">h</span></div>
          <div className="db-stat-desc">de {weekly?.horas_plano || 0}h semanais</div>
          <div className="db-bar"><div className="db-bar-fill" style={{ width: `${pct}%` }} /></div>
          <div className="db-badge y">▼ {weekly?.horas_usadas.toFixed(1) || 0}h usadas</div>
        </div>

        <div className="db-card red-glow">
          <div className="db-card-label"><div className="dot" />Sessões concluídas</div>
          <div className="db-stat-val">{stats?.total_sessoes_concluidas || 0}</div>
          <div className="db-stat-desc">total histórico</div>
          <div className="db-badge g">▲ sessões</div>
        </div>

        <div className="db-card red-glow">
          <div className="db-card-label"><div className="dot" />Próxima sessão</div>
          {stats?.proxima_sessao ? (
            <>
              <div className="db-stat-val bebas" style={{ fontSize: 28, paddingTop: 4 }}>{stats.proxima_sessao.data}</div>
              <div className="db-stat-desc">{stats.proxima_sessao.hora_inicio} – {stats.proxima_sessao.hora_fim}</div>
              <div style={{ marginTop: 10 }}>
                <span className={`status-pill ${stats.proxima_sessao.estado === "confirmada" ? "sp-ok" : "sp-pend"}`}>
                  <span className="material-symbols-outlined" style={{ fontSize: 11 }}>{stats.proxima_sessao.estado === "confirmada" ? "check_circle" : "pending"}</span>
                  {stats.proxima_sessao.estado}
                </span>
              </div>
            </>
          ) : (
            <div className="db-stat-desc" style={{ marginTop: 8 }}>Nenhuma agendada</div>
          )}
        </div>

        <div className="db-card red-glow">
          <div className="db-card-label"><div className="dot" />Duração sessão</div>
          <div className="db-stat-val">{weekly?.duracao_sessao || 0}<span className="u">min</span></div>
          <div className="db-stat-desc">por sessão do plano</div>
        </div>
      </div>

      {/* Quick actions */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Link href="/cliente/marcar" style={{ textDecoration: "none" }}>
          <button className="marcar-cta">
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>add_circle</span>
            Marcar nova sessão
          </button>
        </Link>
        <Link href="/cliente/sessoes" style={{ textDecoration: "none" }}>
          <button className="marcar-cta" style={{ background: "rgba(255,255,255,.05)", boxShadow: "none", border: "1px solid var(--border)" }}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>calendar_month</span>
            Ver sessões
          </button>
        </Link>
      </div>
    </div>
  );
}
