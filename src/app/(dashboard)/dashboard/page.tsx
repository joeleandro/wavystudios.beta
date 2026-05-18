"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function ClienteDashboard() {
  const [profile, setProfile] = useState<any>(null);
  const [sessoes, setSessoes] = useState<any[]>([]);
  const [horasInfo, setHorasInfo] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: prof } = await supabase.from("profiles").select("*, planos(*)").eq("id", user.id).single();
    setProfile(prof);

    const { data: sess } = await supabase
      .from("sessoes")
      .select("*")
      .eq("cliente_id", user.id)
      .order("data", { ascending: false })
      .limit(10);
    setSessoes(sess || []);

    // Calculate weekly hours
    const now = new Date();
    const day = now.getDay();
    const monday = new Date(now);
    monday.setDate(now.getDate() - day + (day === 0 ? -6 : 1));
    const mondayStr = monday.toISOString().split("T")[0];
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    const sundayStr = sunday.toISOString().split("T")[0];

    const { data: weekSess } = await supabase
      .from("sessoes")
      .select("duracao_minutos")
      .eq("cliente_id", user.id)
      .gte("data", mondayStr)
      .lte("data", sundayStr)
      .in("estado", ["pendente", "confirmada", "concluida"]);

    const usadasMin = (weekSess || []).reduce((s: number, x: any) => s + x.duracao_minutos, 0);
    const planoMin = (prof?.planos?.horas_semanais || 0) * 60;

    setHorasInfo({ usadas: usadasMin, plano: planoMin, restantes: Math.max(0, planoMin - usadasMin) });
  }

  const pct = horasInfo ? Math.round((horasInfo.usadas / Math.max(1, horasInfo.plano)) * 100) : 0;
  const proximaSessao = sessoes.find(s => s.estado === "confirmada" || s.estado === "pendente");

  return (
    <div style={{ maxWidth: 1200 }}>
      <div style={{ marginBottom: 26 }}>
        <div className="db-page-title bebas">Olá, {(profile?.nome || "").split(" ")[0] || "Cliente"}</div>
        <div className="db-page-sub">PLANO {profile?.planos?.nome?.toUpperCase() || "—"} • {profile?.estado?.toUpperCase() || "PENDENTE"}</div>
      </div>

      {profile?.estado === "pendente" && (
        <div className="db-card" style={{ background: "rgba(234,179,8,.06)", borderColor: "rgba(234,179,8,.2)", marginBottom: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 20, color: "#facc15" }}>hourglass_top</span>
            <div>
              <div style={{ fontSize: 14, fontWeight: 500, color: "var(--text)" }}>Conta pendente de ativação</div>
              <div style={{ fontSize: 12, color: "var(--text3)", marginTop: 2 }}>O admin irá ativar a tua subscrição após confirmação do pagamento.</div>
            </div>
          </div>
        </div>
      )}

      <div className="db-grid-4">
        <div className="db-card red-glow">
          <div className="db-card-label"><div className="dot" />Horas restantes</div>
          <div className="db-stat-val">{horasInfo ? (horasInfo.restantes / 60).toFixed(1) : 0}<span className="u">h</span></div>
          <div className="db-stat-desc">de {profile?.planos?.horas_semanais || 0}h semanais</div>
          <div className="db-bar"><div className="db-bar-fill" style={{ width: `${pct}%` }} /></div>
        </div>

        <div className="db-card red-glow">
          <div className="db-card-label"><div className="dot" />Sessões</div>
          <div className="db-stat-val">{sessoes.length}</div>
          <div className="db-stat-desc">total marcadas</div>
        </div>

        <div className="db-card red-glow">
          <div className="db-card-label"><div className="dot" />Próxima</div>
          {proximaSessao ? (
            <>
              <div className="db-stat-val bebas" style={{ fontSize: 24 }}>{proximaSessao.data}</div>
              <div className="db-stat-desc">{proximaSessao.hora_inicio} – {proximaSessao.hora_fim}</div>
              <span className={`status-pill ${proximaSessao.estado === "confirmada" ? "sp-ok" : "sp-pend"}`} style={{ marginTop: 8 }}>{proximaSessao.estado}</span>
            </>
          ) : <div className="db-stat-desc">Nenhuma</div>}
        </div>

        <div className="db-card red-glow">
          <div className="db-card-label"><div className="dot" />Duração</div>
          <div className="db-stat-val">{profile?.planos?.duracao_sessao_min || 0}<span className="u">min</span></div>
          <div className="db-stat-desc">por sessão</div>
        </div>
      </div>

      {/* Sessions table */}
      <div className="db-grid-main-sm" style={{ marginTop: 16 }}>
        <div className="db-card">
          <div className="db-card-label"><div className="dot" />Sessões recentes</div>
          {sessoes.length > 0 ? (
            <table className="db-table">
              <thead><tr><th>Data</th><th>Hora</th><th>Tipo</th><th>Estado</th></tr></thead>
              <tbody>
                {sessoes.slice(0, 6).map(s => (
                  <tr key={s.id}>
                    <td>{s.data}</td>
                    <td>{s.hora_inicio}</td>
                    <td style={{ textTransform: "capitalize" }}>{s.tipo?.replace("_", "/")}</td>
                    <td><span className={`status-pill ${s.estado === "confirmada" ? "sp-ok" : s.estado === "pendente" ? "sp-pend" : s.estado === "cancelada" || s.estado === "recusada" ? "sp-cancel" : "sp-done"}`}>{s.estado}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : <div style={{ textAlign: "center", padding: "24px 0", color: "var(--text3)", fontSize: 12 }}>Sem sessões</div>}
        </div>

        <div className="db-card red-glow" style={{ background: "rgba(139,0,0,.04)", borderColor: "rgba(139,0,0,.2)" }}>
          <div className="db-card-label"><div className="dot" />Plano</div>
          <div className="plano-name-big">{profile?.planos?.nome || "—"}</div>
          <ul className="plano-feats" style={{ marginTop: 12 }}>
            <li><span className="material-symbols-outlined">check_circle</span>{profile?.planos?.horas_semanais || 0}h/semana</li>
            <li><span className="material-symbols-outlined">check_circle</span>Sessões de {profile?.planos?.duracao_sessao_min || 0}min</li>
            <li><span className="material-symbols-outlined">check_circle</span>{profile?.planos?.mix_master_mes || 0} Mix/Master</li>
          </ul>
          <Link href="/sessoes" style={{ textDecoration: "none" }}>
            <button className="marcar-cta" style={{ marginTop: 16 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>add_circle</span>Marcar sessão
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
