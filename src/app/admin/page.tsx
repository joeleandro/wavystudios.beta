"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

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
    if (res.ok) setStats(await res.json());
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
    if (res.ok) { fetchStats(); fetchNotificacoes(); }
  }

  const userName = session?.user?.name || "Admin";
  const hours = currentTime.getHours().toString().padStart(2, "0");
  const mins = currentTime.getMinutes().toString().padStart(2, "0");

  return (
    <div style={{ maxWidth: 1400 }}>
      <div style={{ marginBottom: 26 }}>
        <div className="db-page-title bebas">Overview</div>
        <div className="db-page-sub">Monitorizar métricas e gerir a plataforma</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 16 }}>
        {/* Left column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Welcome card */}
          <div className="db-card red-glow" style={{ position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, right: 0, width: 200, height: 200, background: "radial-gradient(circle, rgba(139,0,0,.1) 0%, transparent 70%)", pointerEvents: "none" }} />
            <div style={{ position: "relative", zIndex: 1, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: 18, fontWeight: 300, color: "var(--text)" }}>Olá, {userName.split(" ")[0]}</div>
                <div style={{ fontSize: 13, color: "var(--text3)", marginTop: 4 }}>Pronto para gerir o estúdio hoje</div>
                <div className="bebas" style={{ fontSize: 52, marginTop: 16, color: "var(--text)", letterSpacing: ".02em" }}>
                  {hours}:{mins}
                  <span style={{ fontSize: 16, color: "var(--text3)", marginLeft: 8, fontFamily: "'Sora', sans-serif", fontWeight: 300 }}>
                    {currentTime.getHours() >= 12 ? "PM" : "AM"}
                  </span>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 12, color: "var(--text3)" }}>
                  {currentTime.toLocaleDateString("pt-PT", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                </div>
              </div>
            </div>
          </div>

          {/* 4 Stat cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
            <div className="db-card red-glow">
              <div className="db-card-label"><div className="dot" />Clientes Ativos</div>
              <div className="db-stat-val">{stats?.clientes_ativos || 0}</div>
              <div className="db-stat-desc">registados</div>
              <div className="db-badge g">▲ +1</div>
            </div>
            <div className="db-card red-glow">
              <div className="db-card-label"><div className="dot" />Horas Mês</div>
              <div className="db-stat-val">{stats?.horas_mes || 0}<span className="u">h</span></div>
              <div className="db-stat-desc">trabalhadas</div>
            </div>
            <div className="db-card red-glow">
              <div className="db-card-label"><div className="dot" />Sessões Hoje</div>
              <div className="db-stat-val">{stats?.sessoes_hoje || 0}</div>
              <div className="db-stat-desc">agendadas</div>
            </div>
            <div className="db-card red-glow">
              <div className="db-card-label"><div className="dot" />Ocupação</div>
              <div className="db-stat-val">{stats?.ocupacao || 0}<span className="u">%</span></div>
              <div className="db-stat-desc">do estúdio</div>
              <div className="db-bar"><div className="db-bar-fill" style={{ width: `${stats?.ocupacao || 0}%` }} /></div>
            </div>
          </div>

          {/* Pending sessions */}
          <div className="db-card">
            <div className="db-card-label" style={{ justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}><div className="dot" />Sessões Pendentes</div>
              <span style={{ fontSize: 10, color: "var(--primary)" }}>{stats?.sessoes_pendentes || 0} aguardam</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {stats?.sessoes_recentes?.filter(s => s.estado === "pendente").map((sessao) => (
                <div key={sessao.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", background: "rgba(255,255,255,.02)", borderRadius: 10, border: "1px solid var(--border)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 36, height: 36, background: "rgba(139,0,0,.1)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 16, color: "var(--primary)" }}>mic</span>
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text)" }}>{sessao.cliente_nome}</div>
                      <div style={{ fontSize: 11, color: "var(--text3)" }}>{sessao.tipo} • {sessao.data} • {sessao.hora_inicio}–{sessao.hora_fim}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button onClick={() => handleSessionAction(sessao.id, "confirmada")} style={{ width: 30, height: 30, background: "rgba(34,197,94,.1)", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(34,197,94,.2)" }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 14, color: "#4ade80" }}>check</span>
                    </button>
                    <button onClick={() => handleSessionAction(sessao.id, "cancelada")} style={{ width: 30, height: 30, background: "rgba(239,68,68,.1)", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(239,68,68,.2)" }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 14, color: "#f87171" }}>close</span>
                    </button>
                  </div>
                </div>
              ))}
              {(!stats?.sessoes_recentes || stats.sessoes_recentes.filter(s => s.estado === "pendente").length === 0) && (
                <div style={{ textAlign: "center", padding: "32px 0", color: "var(--text3)", fontSize: 12 }}>Nenhuma sessão pendente</div>
              )}
            </div>
          </div>

          {/* Sessions table */}
          <div className="db-card">
            <div className="db-card-label"><div className="dot" />Sessões Recentes</div>
            <table className="db-table">
              <thead><tr>
                <th>Cliente</th><th>Tipo</th><th>Data</th><th>Horário</th><th>Estado</th>
              </tr></thead>
              <tbody>
                {stats?.sessoes_recentes?.map((s) => (
                  <tr key={s.id}>
                    <td style={{ color: "var(--text)", fontWeight: 500 }}>{s.cliente_nome}</td>
                    <td style={{ textTransform: "capitalize" }}>{s.tipo.replace("_", "/")}</td>
                    <td>{s.data}</td>
                    <td>{s.hora_inicio}–{s.hora_fim}</td>
                    <td>
                      <span className={`status-pill ${s.estado === "confirmada" ? "sp-ok" : s.estado === "pendente" ? "sp-pend" : s.estado === "cancelada" ? "sp-cancel" : "sp-done"}`}>
                        {s.estado}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Revenue */}
          <div className="db-card red-glow">
            <div className="db-card-label"><div className="dot" />Receita Mensal</div>
            <div style={{ textAlign: "center", padding: "12px 0" }}>
              <div className="db-stat-val bebas" style={{ fontSize: 48 }}>€{stats?.receita_mes || 0}</div>
              <div className="db-stat-desc">{stats?.clientes_ativos || 0} clientes ativos</div>
            </div>
          </div>

          {/* Performance ring */}
          <div className="db-card red-glow">
            <div className="db-card-label"><div className="dot" />Performance</div>
            <div style={{ display: "flex", alignItems: "center", gap: 20, padding: "8px 0" }}>
              <svg width="108" height="108" viewBox="0 0 108 108" style={{ flexShrink: 0 }}>
                <circle cx="54" cy="54" r="40" fill="none" stroke="rgba(255,255,255,.06)" strokeWidth="10" />
                <circle cx="54" cy="54" r="40" fill="none" stroke="url(#rg)" strokeWidth="10"
                  strokeDasharray="251.3" strokeDashoffset={251.3 - (251.3 * (stats?.ocupacao || 0) / 100)} strokeLinecap="round" transform="rotate(-90 54 54)" />
                <defs>
                  <linearGradient id="rg" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8b0000" /><stop offset="100%" stopColor="#ffb4a8" />
                  </linearGradient>
                </defs>
                <text x="54" y="50" textAnchor="middle" fill="#e5e2e1" fontFamily="'Bebas Neue', sans-serif" fontSize="19">{stats?.ocupacao || 0}%</text>
                <text x="54" y="62" textAnchor="middle" fill="rgba(229,226,225,.4)" fontSize="8" fontFamily="'Sora', sans-serif">ocupação</text>
              </svg>
              <div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11, color: "var(--text2)" }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--primary)" }} />Ocupação {stats?.ocupacao || 0}%
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11, color: "var(--text2)" }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#facc15" }} />{stats?.horas_mes || 0}h trabalhadas
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11, color: "var(--text2)" }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: "rgba(255,255,255,.15)" }} />{stats?.sessoes_pendentes || 0} pendentes
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="db-card">
            <div className="db-card-label" style={{ justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}><div className="dot" />Notificações</div>
              {naoLidas > 0 && <span style={{ fontSize: 10, color: "var(--primary)" }}>{naoLidas} novas</span>}
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {notificacoes.slice(0, 5).map((n) => (
                <div key={n.id} className="notif-item-db">
                  <div className={`notif-ico-db ${n.lida ? "nic-r" : "nic-g"}`}>
                    <span className="material-symbols-outlined">{n.lida ? "notifications" : "check_circle"}</span>
                  </div>
                  <div>
                    <div className="notif-txt">{n.mensagem}</div>
                    <div className="notif-tm">{new Date(n.criada_em).toLocaleString("pt-PT")}</div>
                  </div>
                </div>
              ))}
              {notificacoes.length === 0 && (
                <div style={{ textAlign: "center", padding: "24px 0", color: "var(--text3)", fontSize: 12 }}>Sem notificações</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
