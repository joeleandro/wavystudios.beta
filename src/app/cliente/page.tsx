"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";

interface WeeklyStatus { semana_inicio: string; horas_plano: number; horas_usadas: number; horas_restantes: number; plano_nome: string; duracao_sessao: number; }
interface Sessao { id: string; tipo: string; data: string; hora_inicio: string; hora_fim: string; duracao_minutos: number; estado: string; }
interface ClienteStats { weekly: WeeklyStatus | null; proxima_sessao: Sessao | null; total_sessoes_concluidas: number; }

export default function ClienteDashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<ClienteStats | null>(null);
  const [sessoes, setSessoes] = useState<Sessao[]>([]);

  useEffect(() => {
    fetch("/api/stats").then(r => r.json()).then(setStats);
    fetch("/api/sessoes").then(r => r.json()).then(d => setSessoes(d.sessoes || []));
  }, []);

  const userName = session?.user?.name || "Cliente";
  const weekly = stats?.weekly;
  const pct = weekly ? Math.round((weekly.horas_usadas / weekly.horas_plano) * 100) : 0;

  return (
    <div style={{ maxWidth: 1200 }}>
      <div style={{ marginBottom: 26 }}>
        <div className="db-page-title bebas">Olá, {userName.split(" ")[0]}</div>
        <div className="db-page-sub">EST. 2024 — PLANO {weekly?.plano_nome?.toUpperCase() || "—"} ATIVO</div>
      </div>

      {/* 4 stat cards */}
      <div className="db-grid-4">
        <div className="db-card red-glow">
          <div className="db-card-label"><div className="dot" />Horas restantes</div>
          <div className="db-stat-val">{weekly?.horas_restantes?.toFixed(1) || 0}<span className="u">h</span></div>
          <div className="db-stat-desc">de {weekly?.horas_plano || 0}h semanais</div>
          <div className="db-bar"><div className="db-bar-fill" style={{ width: `${pct}%` }} /></div>
          <div className="db-badge y">▼ {weekly?.horas_usadas?.toFixed(1) || 0}h usadas</div>
        </div>

        <div className="db-card red-glow">
          <div className="db-card-label"><div className="dot" />Sessões este mês</div>
          <div className="db-stat-val">{sessoes.length}</div>
          <div className="db-stat-desc">sessões marcadas</div>
          <div className="db-bar"><div className="db-bar-fill" style={{ width: `${Math.min(100, sessoes.length * 15)}%` }} /></div>
          <div className="db-badge g">▲ total</div>
        </div>

        <div className="db-card red-glow">
          <div className="db-card-label"><div className="dot" />Próxima sessão</div>
          {stats?.proxima_sessao ? (
            <>
              <div className="db-stat-val bebas" style={{ fontSize: 26, paddingTop: 4 }}>{stats.proxima_sessao.data}</div>
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
          <div className="db-card-label"><div className="dot" />Mix &amp; Master</div>
          <div className="db-stat-val">1<span className="u">/2</span></div>
          <div className="db-stat-desc">restantes este mês</div>
          <div className="mm-row">
            <div className="mm-b mm-used"><span className="material-symbols-outlined" style={{ fontSize: 14 }}>check</span></div>
            <div className="mm-b mm-free">2</div>
          </div>
        </div>
      </div>

      {/* Sessions table + Plano info */}
      <div className="db-grid-main-sm">
        <div className="db-card">
          <div className="db-card-label"><div className="dot" />Sessões marcadas</div>
          <table className="db-table">
            <thead><tr>
              <th>Data</th><th>Hora</th><th>Duração</th><th>Status</th><th>Horas</th>
            </tr></thead>
            <tbody>
              {sessoes.slice(0, 6).map((s) => (
                <tr key={s.id}>
                  <td><span style={{ display: "flex", alignItems: "center", gap: 6 }}><span className="material-symbols-outlined" style={{ fontSize: 14, color: "var(--text3)" }}>calendar_today</span>{s.data}</span></td>
                  <td>{s.hora_inicio}</td>
                  <td>{s.duracao_minutos}min</td>
                  <td><span className={`status-pill ${s.estado === "confirmada" ? "sp-ok" : s.estado === "pendente" ? "sp-pend" : s.estado === "cancelada" ? "sp-cancel" : "sp-done"}`}>{s.estado}</span></td>
                  <td style={{ color: s.estado === "confirmada" ? "var(--primary)" : "var(--text3)", fontWeight: 600 }}>{(s.duracao_minutos / 60).toFixed(1)}h</td>
                </tr>
              ))}
              {sessoes.length === 0 && (
                <tr><td colSpan={5} style={{ textAlign: "center", padding: "24px 0", color: "var(--text3)" }}>Sem sessões</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Plano card */}
        <div className="db-card red-glow" style={{ background: "rgba(139,0,0,.04)", borderColor: "rgba(139,0,0,.2)" }}>
          <div className="db-card-label"><div className="dot" />Plano atual</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
            <div className="plano-name-big">{weekly?.plano_nome || "—"}</div>
          </div>
          <ul className="plano-feats">
            <li><span className="material-symbols-outlined">check_circle</span>Captação vocal</li>
            <li><span className="material-symbols-outlined">check_circle</span>{weekly?.horas_plano || 0}h semanais</li>
            <li><span className="material-symbols-outlined">check_circle</span>Sessões de {weekly?.duracao_sessao || 0}min</li>
            <li><span className="material-symbols-outlined">check_circle</span>2 Mix/Masters incluídos</li>
          </ul>
          <Link href="/cliente/marcar" style={{ textDecoration: "none" }}>
            <button className="marcar-cta" style={{ marginTop: 20 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>add_circle</span>
              Marcar nova sessão
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
