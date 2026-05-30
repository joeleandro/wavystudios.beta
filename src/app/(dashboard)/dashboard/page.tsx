"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { inicioDoMes, fimDoMes } from "@/lib/utils/dates";
import { DateBadge } from "@/components/ui/DateBadge";

export default function ClienteDashboard() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [sessoes, setSessoes] = useState<any[]>([]);
  const [horasInfo, setHorasInfo] = useState<any>(null);
  const [profileMissing, setProfileMissing] = useState(false);
  const [monthlyInfo, setMonthlyInfo] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    setUser(user);

    let { data: prof, error } = await supabase
      .from("profiles")
      .select("*, planos(*)")
      .eq("id", user.id)
      .single();

    // FIX: auto-create profile via server API if missing (service role bypasses RLS)
    if (error && error.code === "PGRST116") {
      try {
        const res = await fetch("/api/profile", { method: "POST" });
        if (res.ok) {
          const { data: refetch } = await supabase
            .from("profiles")
            .select("*, planos(*)")
            .eq("id", user.id)
            .single();
          prof = refetch;
        } else {
          const fallbackName = user.user_metadata?.nome || user.email?.split("@")[0] || "Artista";
          setProfileMissing(true);
          prof = { nome: fallbackName, estado: "pendente" };
        }
      } catch {
        const fallbackName = user.user_metadata?.nome || user.email?.split("@")[0] || "Artista";
        setProfileMissing(true);
        prof = { nome: fallbackName, estado: "pendente" };
      }
    } else if (error) {
      console.warn("[Dashboard] Profile fetch warning:", error);
      const fallbackName = user.user_metadata?.nome || user.email?.split("@")[0] || "Artista";
      setProfileMissing(true);
      prof = { nome: fallbackName, estado: "pendente" };
    }
    setProfile(prof);

    const { data: sess } = await supabase
      .from("sessoes")
      .select("*")
      .eq("cliente_id", user.id)
      .order("data", { ascending: false })
      .limit(10);
    setSessoes(sess || []);

    // Cycle start = plan renewal date (data_inicio). Used hours only count
    // sessions on/after this date, so "Renovar" resets all counters.
    const cicloInicio: string | null = prof?.data_inicio || null;
    const cicloFim: string | null = prof?.data_renovacao || null;

    // Calculate weekly hours (UTC-safe)
    const now = new Date();
    const utcDay = now.getUTCDay(); // 0=Sun, 1=Mon ...
    const mondayOffset = utcDay === 0 ? -6 : 1 - utcDay;
    const monday = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + mondayOffset));
    const mondayStr = monday.toISOString().split("T")[0];
    const sunday = new Date(Date.UTC(monday.getUTCFullYear(), monday.getUTCMonth(), monday.getUTCDate() + 6));
    const sundayStr = sunday.toISOString().split("T")[0];

    // Weekly lower bound respects the renewal date (don't count sessions before renewal)
    const weekInicio = cicloInicio && cicloInicio > mondayStr ? cicloInicio : mondayStr;

    const { data: weekSess } = await supabase
      .from("sessoes")
      .select("duracao_minutos")
      .eq("cliente_id", user.id)
      .gte("data", weekInicio)
      .lte("data", sundayStr)
      .in("estado", ["pendente", "confirmada", "concluida"]);

    const usadasMin = (weekSess || []).reduce((s: number, x: any) => s + x.duracao_minutos, 0);
    const planoMin = (prof?.planos?.horas_semanais || 0) * 60;

    setHorasInfo({ usadas: usadasMin, plano: planoMin, restantes: Math.max(0, planoMin - usadasMin) });

    // ─── Monthly / cycle data ───
    // Use the renewal cycle (data_inicio → data_renovacao) when available;
    // fall back to the calendar month otherwise.
    const mesInicio = cicloInicio || inicioDoMes(now);
    const mesFim = cicloFim || fimDoMes(now);

    // Monthly hours used (sum duracao_minutos of all sessions in the cycle)
    const { data: monthSess } = await supabase
      .from("sessoes")
      .select("duracao_minutos")
      .eq("cliente_id", user.id)
      .gte("data", mesInicio)
      .lte("data", mesFim)
      .in("estado", ["pendente", "confirmada", "concluida"]);

    const horasMensaisUsadasMin = (monthSess || []).reduce((s: number, x: any) => s + x.duracao_minutos, 0);
    const horasMensaisPlanoMin = (prof?.planos?.horas_semanais || 0) * 4 * 60; // horas_semanais * 4 weeks
    const horasMensaisRestantesMin = Math.max(0, horasMensaisPlanoMin - horasMensaisUsadasMin);

    // Mix/Master used this cycle
    const { count: mmUsados } = await supabase
      .from("sessoes")
      .select("id", { count: "exact", head: true })
      .eq("cliente_id", user.id)
      .eq("tipo", "mix_master")
      .gte("data", mesInicio)
      .lte("data", mesFim)
      .in("estado", ["confirmada", "concluida"]);

    const mmTotal = prof?.planos?.mix_master_mes || 0;
    const mmRestantes = Math.max(0, mmTotal - (mmUsados ?? 0));

    setMonthlyInfo({
      horasUsadasMin: horasMensaisUsadasMin,
      horasPlanoMin: horasMensaisPlanoMin,
      horasRestantesMin: horasMensaisRestantesMin,
      mmUsados: mmUsados ?? 0,
      mmTotal,
      mmRestantes,
    });
  }

  const pct = horasInfo ? Math.round((horasInfo.usadas / Math.max(1, horasInfo.plano)) * 100) : 0;
  const pctMensal = monthlyInfo ? Math.round((monthlyInfo.horasUsadasMin / Math.max(1, monthlyInfo.horasPlanoMin)) * 100) : 0;
  const proximaSessao = sessoes.find(s => s.estado === "confirmada" || s.estado === "pendente");

  // Personalized greeting using first name
  const primeiroNome =
    profile?.nome?.split(" ")[0] ||
    user?.email?.split("@")[0] ||
    "artista";

  const plano = profile?.planos;
  const planoId = plano?.id;

  return (
    <div style={{ maxWidth: "100%" }}>
      <div style={{ marginBottom: 26 }}>
        <div className="db-page-title bebas">Olá, {primeiroNome} 👋</div>
        <div className="db-page-sub">
          PLANO {plano?.nome?.toUpperCase() || "—"} • {profile?.estado?.toUpperCase() || "PENDENTE"}
          {profile?.data_renovacao && (
            <span style={{ marginLeft: 8 }}>
              • Renova: <strong style={{ color: "var(--text)" }}>{new Date(profile.data_renovacao + "T12:00:00").toLocaleDateString("pt-PT", { day: "numeric", month: "short", year: "numeric" })}</strong>
            </span>
          )}
        </div>
      </div>

      {/* Friendly empty state instead of error */}
      {profileMissing && (
        <div className="db-card" style={{ background: "rgba(234,179,8,.06)", borderColor: "rgba(234,179,8,.2)", marginBottom: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 20, color: "#facc15" }}>info</span>
            <div>
              <div style={{ fontSize: 14, fontWeight: 500, color: "var(--text)" }}>Conta em configuração</div>
              <div style={{ fontSize: 12, color: "var(--text3)", marginTop: 2 }}>Entra em contacto connosco para finalizar a tua conta.</div>
            </div>
          </div>
        </div>
      )}

      {profile?.estado === "pendente" && !profileMissing && (
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

      {/* ─── ROW 1: Weekly stats ─── */}
      <div className="db-grid-4">
        <div className="db-card red-glow">
          <div className="db-card-label"><div className="dot" />Horas restantes</div>
          <div className="db-stat-val">{horasInfo ? (horasInfo.restantes / 60).toFixed(1) : 0}<span className="u">h</span></div>
          <div className="db-stat-desc">de {plano?.horas_semanais || 0}h semanais</div>
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
              <DateBadge date={proximaSessao.data} />
              <div className="db-stat-desc" style={{ marginTop: 6 }}>{proximaSessao.hora_inicio} – {proximaSessao.hora_fim}</div>
              <span className={`status-pill ${proximaSessao.estado === "confirmada" ? "sp-ok" : "sp-pend"}`} style={{ marginTop: 8 }}>{proximaSessao.estado}</span>
            </>
          ) : <div className="db-stat-desc">Nenhuma</div>}
        </div>

        <div className="db-card red-glow">
          <div className="db-card-label"><div className="dot" />Duração</div>
          <div className="db-stat-val">{plano?.duracao_sessao_min || 0}<span className="u">min</span></div>
          <div className="db-stat-desc">por sessão</div>
        </div>
      </div>

      {/* ─── ROW 2: Monthly plan details ─── */}
      <div className="db-grid-4" style={{ marginTop: 12 }}>
        {/* Monthly hours */}
        <div className="db-card red-glow">
          <div className="db-card-label"><div className="dot" />Hrs mensais</div>
          <div className="db-stat-val">{monthlyInfo ? (monthlyInfo.horasRestantesMin / 60).toFixed(1) : 0}<span className="u">h</span></div>
          <div className="db-stat-desc">de {(plano?.horas_semanais || 0) * 4}h mês</div>
          <div className="db-bar"><div className="db-bar-fill" style={{ width: `${pctMensal}%` }} /></div>
        </div>

        {/* Mix/Master */}
        <div className="db-card red-glow">
          <div className="db-card-label"><div className="dot" />Mix/Master</div>
          <div className="db-stat-val" style={{ color: monthlyInfo?.mmRestantes === 0 ? "#f87171" : undefined }}>
            {monthlyInfo?.mmRestantes ?? 0}
          </div>
          <div className="db-stat-desc">restantes ({monthlyInfo?.mmUsados ?? 0}/{monthlyInfo?.mmTotal ?? 0} usados)</div>
        </div>

        {/* Sessão Foto — conditional */}
        {plano?.sessao_foto ? (
          <div className="db-card red-glow">
            <div className="db-card-label"><div className="dot" />Sessão foto</div>
            <div className="db-stat-val" style={{ fontSize: 20 }}>INCLUÍDA</div>
            <div className="db-stat-desc">AVANÇADO</div>
          </div>
        ) : (
          <Link href="/precos" style={{ textDecoration: "none" }}>
            <div className="db-card" style={{ background: "rgba(255,255,255,.015)", opacity: 0.6, cursor: "pointer" }}>
              <div className="db-card-label"><div className="dot" />Sessão foto</div>
              <div className="db-stat-val" style={{ fontSize: 18, display: "flex", alignItems: "center", gap: 6 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>lock</span>
                UPGRADE
              </div>
              <div className="db-stat-desc">Plano Avançado</div>
            </div>
          </Link>
        )}

        {/* Instrumental — conditional */}
        {plano?.instrumental ? (
          <div className="db-card red-glow">
            <div className="db-card-label"><div className="dot" />Instrumental</div>
            <div className="db-stat-val" style={{ fontSize: 20 }}>INCLUÍDO</div>
            <div className="db-stat-desc">AVANÇADO</div>
          </div>
        ) : (
          <Link href="/precos" style={{ textDecoration: "none" }}>
            <div className="db-card" style={{ background: "rgba(255,255,255,.015)", opacity: 0.6, cursor: "pointer" }}>
              <div className="db-card-label"><div className="dot" />Instrumental</div>
              <div className="db-stat-val" style={{ fontSize: 18, display: "flex", alignItems: "center", gap: 6 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>lock</span>
                UPGRADE
              </div>
              <div className="db-stat-desc">Plano Avançado</div>
            </div>
          </Link>
        )}
      </div>

      {/* Dir. Criativa — only show if plan has it */}
      {plano?.direcao_criativa && (
        <div className="db-grid-4" style={{ marginTop: 12 }}>
          <div className="db-card red-glow">
            <div className="db-card-label"><div className="dot" />Dir. Criativa</div>
            <div className="db-stat-val" style={{ fontSize: 20 }}>ACTIVA</div>
            <div className="db-stat-desc">AVANÇADO</div>
          </div>
        </div>
      )}

      {/* Sessions table */}
      <div className="db-grid-main-sm" style={{ marginTop: 16 }}>
        <div className="db-card">
          <div className="db-card-label"><div className="dot" />Sessões recentes</div>
          {sessoes.length > 0 ? (
            <table className="db-table">
              <thead><tr><th>Data</th><th>Hora</th><th>Tipo</th><th>Estado</th></tr></thead>
              <tbody>
                {sessoes.slice(0, 6).map(s => {
                  const d = new Date(s.data + "T12:00:00");
                  const shortDate = d.toLocaleDateString("pt-PT", { weekday: "short", day: "numeric", month: "short", year: "numeric" }).replace(/^\w/, c => c.toUpperCase()).replace(/\./g, "");
                  return (
                    <tr key={s.id}>
                      <td style={{ fontWeight: 600, color: "var(--text)" }}>{shortDate}</td>
                      <td>{s.hora_inicio}</td>
                      <td style={{ textTransform: "capitalize" }}>{s.tipo?.replace("_", "/")}</td>
                      <td><span className={`status-pill ${s.estado === "confirmada" ? "sp-ok" : s.estado === "pendente" ? "sp-pend" : s.estado === "cancelada" || s.estado === "recusada" ? "sp-cancel" : "sp-done"}`}>{s.estado}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : <div style={{ textAlign: "center", padding: "24px 0", color: "var(--text3)", fontSize: 12 }}>Sem sessões</div>}
        </div>

        <div className="db-card red-glow" style={{ background: "rgba(139,0,0,.04)", borderColor: "rgba(139,0,0,.2)" }}>
          <div className="db-card-label"><div className="dot" />Plano</div>
          <div className="plano-name-big">{plano?.nome || "—"}</div>
          <ul className="plano-feats" style={{ marginTop: 12 }}>
            <li><span className="material-symbols-outlined">check_circle</span>{plano?.horas_semanais || 0}h/semana ({(plano?.horas_semanais || 0) * 4}h/mês)</li>
            <li><span className="material-symbols-outlined">check_circle</span>Sessões de {plano?.duracao_sessao_min || 0}min</li>
            <li><span className="material-symbols-outlined">check_circle</span>{plano?.mix_master_mes || 0} Mix/Master/mês</li>
            {(planoId === 2 || planoId === 3) && (
              <>
                <li><span className="material-symbols-outlined">check_circle</span>Prioridade na marcação</li>
                <li><span className="material-symbols-outlined">check_circle</span>Suporte dedicado</li>
              </>
            )}
            {planoId === 3 && (
              <>
                {plano?.sessao_foto && <li><span className="material-symbols-outlined">check_circle</span>Sessão Fotográfica (15 fotos)</li>}
                {plano?.instrumental && <li><span className="material-symbols-outlined">check_circle</span>1 Instrumental Exclusivo</li>}
                {plano?.direcao_criativa && <li><span className="material-symbols-outlined">check_circle</span>Direção Criativa personalizada</li>}
                {plano?.pagamento_5050 && <li><span className="material-symbols-outlined">check_circle</span>Pagamento 50/50 disponível</li>}
              </>
            )}
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
