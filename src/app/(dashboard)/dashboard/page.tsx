"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { DateBadge } from "@/components/ui/DateBadge";

interface HorasData {
  // Weekly (within cycle)
  horasUsadasSemana: number
  horasRestantesSemana: number
  horasPlanoDiaSemana: number
  semanaActual: number
  totalSemanas: number

  // Cycle (monthly)
  horasUsadasCiclo: number
  horasRestantesCiclo: number
  horasPlanoCiclo: number
  diasRestantesCiclo: number

  // Mix/Master
  mmUsados: number
  mmRestantes: number
  mmPlano: number

  // Sessions
  totalSessoesCiclo: number
}

export default function ClienteDashboard() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [sessoes, setSessoes] = useState<any[]>([]);
  const [horas, setHoras] = useState<HorasData | null>(null);
  const [profileMissing, setProfileMissing] = useState(false);
  const [proximaSessao, setProximaSessao] = useState<any>(null);
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
          setProfileMissing(true);
          prof = { nome: user.user_metadata?.nome || user.email?.split("@")[0] || "Artista", estado: "pendente" };
        }
      } catch {
        setProfileMissing(true);
        prof = { nome: user.user_metadata?.nome || user.email?.split("@")[0] || "Artista", estado: "pendente" };
      }
    } else if (error) {
      setProfileMissing(true);
      prof = { nome: user.user_metadata?.nome || user.email?.split("@")[0] || "Artista", estado: "pendente" };
    }
    setProfile(prof);

    // Recent sessions (for table)
    const { data: sess } = await supabase
      .from("sessoes")
      .select("*")
      .eq("cliente_id", user.id)
      .order("data", { ascending: false })
      .limit(10);
    setSessoes(sess || []);

    // ─── Dynamic hours calculation (mirrors calcularHorasCliente) ───
    const plano = prof?.planos;
    const dataInicio = prof?.data_inicio;
    const dataRenovacao = prof?.data_renovacao;

    if (!plano || !dataInicio || !dataRenovacao) {
      // No cycle configured — show zeros
      setHoras(null);
      return;
    }

    // Fetch all confirmed/concluded sessions within cycle
    const { data: cicloSessoes } = await supabase
      .from("sessoes")
      .select("data, duracao_minutos, tipo, estado")
      .eq("cliente_id", user.id)
      .in("estado", ["confirmada", "concluida"])
      .gte("data", dataInicio)
      .lt("data", dataRenovacao)
      .order("data", { ascending: true });

    const sessoesValidas = cicloSessoes || [];

    // Calculate which week of the cycle we're in
    const hoje = new Date();
    const inicioDate = new Date(dataInicio + "T00:00:00Z");
    const diasDecorridos = Math.max(0, Math.floor(
      (hoje.getTime() - inicioDate.getTime()) / (1000 * 60 * 60 * 24)
    ));
    const semanaIdx = Math.min(Math.floor(diasDecorridos / 7), 3); // 0-3

    const inicioSemana = new Date(inicioDate);
    inicioSemana.setUTCDate(inicioDate.getUTCDate() + semanaIdx * 7);
    const fimSemana = new Date(inicioSemana);
    fimSemana.setUTCDate(inicioSemana.getUTCDate() + 7);

    const inicioSemanaStr = inicioSemana.toISOString().split("T")[0];
    const fimSemanaStr = fimSemana.toISOString().split("T")[0];

    // Sessions this week
    const sessoesSemana = sessoesValidas.filter(
      (s: any) => s.data >= inicioSemanaStr && s.data < fimSemanaStr
    );
    const minutosUsadosSemana = sessoesSemana.reduce((acc: number, s: any) => acc + s.duracao_minutos, 0);
    const horasUsadasSemana = minutosUsadosSemana / 60;
    const horasPlanoDiaSemana = plano.horas_semanais || 0;
    const horasRestantesSemana = Math.max(0, horasPlanoDiaSemana - horasUsadasSemana);

    // Full cycle hours
    const minutosTotaisCiclo = sessoesValidas.reduce((acc: number, s: any) => acc + s.duracao_minutos, 0);
    const horasUsadasCiclo = minutosTotaisCiclo / 60;
    const horasPlanoCiclo = (plano.horas_semanais || 0) * 4;
    const horasRestantesCiclo = Math.max(0, horasPlanoCiclo - horasUsadasCiclo);

    // Mix/Master
    const mmUsados = sessoesValidas.filter((s: any) => s.tipo === "mix_master").length;
    const mmPlano = plano.mix_master_mes || 0;
    const mmRestantes = Math.max(0, mmPlano - mmUsados);

    // Days remaining
    const renovacaoDate = new Date(dataRenovacao + "T00:00:00Z");
    const diasRestantesCiclo = Math.max(0, Math.ceil(
      (renovacaoDate.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24)
    ));

    setHoras({
      horasUsadasSemana,
      horasRestantesSemana,
      horasPlanoDiaSemana,
      semanaActual: semanaIdx + 1,
      totalSemanas: 4,
      horasUsadasCiclo,
      horasRestantesCiclo,
      horasPlanoCiclo,
      diasRestantesCiclo,
      mmUsados,
      mmRestantes,
      mmPlano,
      totalSessoesCiclo: sessoesValidas.length,
    });

    // Next session
    const hojeStr = hoje.toISOString().split("T")[0];
    const { data: proxima } = await supabase
      .from("sessoes")
      .select("*")
      .eq("cliente_id", user.id)
      .in("estado", ["confirmada", "pendente"])
      .gte("data", hojeStr)
      .order("data", { ascending: true })
      .order("hora_inicio", { ascending: true })
      .limit(1)
      .maybeSingle();
    setProximaSessao(proxima);
  }

  const primeiroNome = profile?.nome?.split(" ")[0] || user?.email?.split("@")[0] || "artista";
  const plano = profile?.planos;
  const planoId = plano?.id;

  // Progress percentages
  const pctSemana = horas ? Math.round((horas.horasUsadasSemana / Math.max(0.01, horas.horasPlanoDiaSemana)) * 100) : 0;
  const pctCiclo = horas ? Math.round((horas.horasUsadasCiclo / Math.max(0.01, horas.horasPlanoCiclo)) * 100) : 0;

  return (
    <div style={{ maxWidth: "100%" }}>
      <div style={{ marginBottom: 26 }}>
        <div className="db-page-title bebas">Olá, {primeiroNome} 👋</div>
        <div className="db-page-sub">
          PLANO {plano?.nome?.toUpperCase() || "—"} • {profile?.estado?.toUpperCase() || "PENDENTE"}
          {profile?.data_renovacao && (
            <span style={{ marginLeft: 8 }}>
              • Renova: <strong style={{ color: "var(--text)" }}>{new Date(profile.data_renovacao + "T12:00:00").toLocaleDateString("pt-PT", { day: "numeric", month: "short", year: "numeric" })}</strong>
              {horas && <span style={{ marginLeft: 6, fontSize: 10, color: "var(--text3)" }}>({horas.diasRestantesCiclo} dias)</span>}
            </span>
          )}
        </div>
      </div>

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
          <div className="db-card-label"><div className="dot" />Horas semana</div>
          <div className="db-stat-val">{horas ? horas.horasRestantesSemana.toFixed(1) : 0}<span className="u">h</span></div>
          <div className="db-stat-desc">de {horas?.horasPlanoDiaSemana || plano?.horas_semanais || 0}h semanais</div>
          <div className="db-bar"><div className="db-bar-fill" style={{ width: `${pctSemana}%` }} /></div>
          {horas && <div style={{ fontSize: 10, color: "var(--text3)", marginTop: 4 }}>Semana {horas.semanaActual} de {horas.totalSemanas}</div>}
        </div>

        <div className="db-card red-glow">
          <div className="db-card-label"><div className="dot" />Sessões</div>
          <div className="db-stat-val">{horas?.totalSessoesCiclo ?? sessoes.length}</div>
          <div className="db-stat-desc">no ciclo actual</div>
        </div>

        <div className="db-card red-glow">
          <div className="db-card-label"><div className="dot" />Próxima</div>
          {proximaSessao ? (
            <>
              <DateBadge date={proximaSessao.data} size="sm" />
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

      {/* ─── ROW 2: Cycle / monthly stats ─── */}
      <div className="db-grid-4" style={{ marginTop: 12 }}>
        <div className="db-card red-glow">
          <div className="db-card-label"><div className="dot" />Hrs ciclo</div>
          <div className="db-stat-val">{horas ? horas.horasRestantesCiclo.toFixed(1) : 0}<span className="u">h</span></div>
          <div className="db-stat-desc">de {horas?.horasPlanoCiclo || (plano?.horas_semanais || 0) * 4}h mensais</div>
          <div className="db-bar"><div className="db-bar-fill" style={{ width: `${pctCiclo}%` }} /></div>
          {horas && <div style={{ fontSize: 10, color: "var(--text3)", marginTop: 4 }}>Renova em {horas.diasRestantesCiclo} dias</div>}
        </div>

        <div className="db-card red-glow">
          <div className="db-card-label"><div className="dot" />Mix/Master</div>
          <div className="db-stat-val" style={{ color: horas?.mmRestantes === 0 ? "#f87171" : undefined }}>
            {horas?.mmRestantes ?? 0}
          </div>
          <div className="db-stat-desc">restantes ({horas?.mmUsados ?? 0} de {horas?.mmPlano ?? 0} usados)</div>
        </div>

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
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>lock</span>UPGRADE
              </div>
              <div className="db-stat-desc">Plano Avançado</div>
            </div>
          </Link>
        )}

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
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>lock</span>UPGRADE
              </div>
              <div className="db-stat-desc">Plano Avançado</div>
            </div>
          </Link>
        )}
      </div>

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
