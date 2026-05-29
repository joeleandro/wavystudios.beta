"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { format, addDays } from "date-fns";
import { pt } from "date-fns/locale";
import { createClient } from "@/lib/supabase/client";

export default function MarcarSessaoPage() {
  const router = useRouter();
  const supabase = createClient();
  const [step, setStep] = useState(1);
  const [tipo, setTipo] = useState("");
  const [produtor, setProdutor] = useState("");
  const [data, setData] = useState("");
  const [slots, setSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [loading, setLoading] = useState(false);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [duracao, setDuracao] = useState(60);
  const [primeiroNome, setPrimeiroNome] = useState("artista");

  const today = new Date();
  const days = Array.from({ length: 14 }, (_, i) => addDays(today, i + 1));

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: profile } = await supabase
        .from("profiles")
        .select("nome, planos(duracao_sessao_min)")
        .eq("id", user.id)
        .single();
      if ((profile as any)?.planos?.duracao_sessao_min) setDuracao((profile as any).planos.duracao_sessao_min);
      setPrimeiroNome(
        (profile as any)?.nome?.split(" ")[0] ||
        user.email?.split("@")[0] ||
        "artista"
      );
    }
    init();
  }, []);

  useEffect(() => { if (data) fetchSlots(); }, [data, duracao]);

  async function fetchSlots() {
    setSlotsLoading(true);
    setSelectedSlot("");
    try {
      const res = await fetch(`/api/sessoes?data=${data}&slots=true&duracao=${duracao}`);
      if (res.ok) { const d = await res.json(); setSlots(d.slots || []); }
      else setSlots([]);
    } catch { setSlots([]); }
    setSlotsLoading(false);
  }

  async function handleBook() {
    if (!tipo || !data || !selectedSlot || !produtor) {
      setError("Preenche todos os campos");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/sessoes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data, hora_inicio: selectedSlot, tipo, produtor }),
      });
      const result = await res.json();
      if (!res.ok) { setError(result.error || "Erro ao marcar sessão"); setLoading(false); return; }
      setSuccess(result.message || "Sessão marcada!");
      setTimeout(() => router.push("/dashboard"), 2500);
    } catch (e) {
      setError("Erro de rede. Tenta novamente.");
    }
    setLoading(false);
  }

  function reset() {
    setStep(1); setTipo(""); setProdutor(""); setData(""); setSlots([]);
    setSelectedSlot(""); setError(""); setSuccess("");
  }

  const tipoOptions = [
    { value: "captacao", label: "Captação Vocal", icon: "mic", desc: "Gravação de voz" },
    { value: "mix_master", label: "Mix & Master", icon: "tune", desc: "Finalização áudio" },
    { value: "producao", label: "Produção", icon: "piano", desc: "Criação musical" },
    { value: "foto", label: "Foto/Vídeo", icon: "photo_camera", desc: "Conteúdo visual" },
  ];

  const produtores = [
    { name: "Bere", role: "Vocal Producer" },
    { name: "Wavy", role: "Beat Maker" },
    { name: "Alexandre Campos", role: "Mix Engineer" },
    { name: "Yang", role: "Producer" },
  ];

  // Progress indicator
  const totalSteps = 4;
  const progressPct = Math.min(100, (step / totalSteps) * 100);

  if (success) {
    return (
      <div style={{ maxWidth: 600, margin: "0 auto", paddingTop: 60 }}>
        <div className="db-card anim-fade-in" style={{ textAlign: "center", padding: "56px 32px" }}>
          <div className="wavy-check-circle">
            <span className="material-symbols-outlined" style={{ fontSize: 36, color: "#4ade80" }}>check_circle</span>
          </div>
          <h2 className="bebas" style={{ fontSize: 32, marginTop: 20, color: "var(--text)" }}>Sessão Marcada!</h2>
          <p style={{ fontSize: 14, color: "var(--text2)", marginTop: 10, lineHeight: 1.6 }}>
            A tua sessão fica <strong>pendente</strong> até o admin confirmar. Receberás notificação.
          </p>
          <div style={{ marginTop: 24, padding: 16, background: "rgba(139,0,0,.04)", borderRadius: 10, border: "1px solid rgba(139,0,0,.15)" }}>
            <div style={{ fontSize: 12, color: "var(--text3)", letterSpacing: ".1em", textTransform: "uppercase" }}>Resumo</div>
            <div style={{ fontSize: 15, color: "var(--text)", marginTop: 8, fontWeight: 500 }}>
              {tipo} • {data} • {selectedSlot} • {produtor}
            </div>
          </div>
          <button onClick={() => router.push("/dashboard")} className="marcar-cta" style={{ marginTop: 24 }}>
            Voltar ao Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div className="db-page-title bebas">Marcar Sessão</div>
        <div className="db-page-sub">
          {duracao}min por sessão • Horário: 12h – 16h (meio-dia à tarde)
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          {["Tipo", "Data", "Horário", "Produtor"].map((label, i) => (
            <span key={label} style={{
              fontSize: 10, fontWeight: 600, letterSpacing: ".12em", textTransform: "uppercase",
              color: step > i ? "var(--primary)" : step === i + 1 ? "var(--text)" : "var(--text3)",
              transition: "color .3s"
            }}>{label}</span>
          ))}
        </div>
        <div style={{ height: 3, background: "rgba(255,255,255,.06)", borderRadius: 3, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${progressPct}%`, background: "linear-gradient(90deg, var(--primary-c), var(--primary))", borderRadius: 3, transition: "width .4s ease" }} />
        </div>
      </div>

      {/* Error display */}
      {error && (
        <div className="anim-fade-in" style={{ background: "rgba(239,68,68,.06)", border: "1px solid rgba(239,68,68,.2)", borderRadius: 12, padding: "14px 18px", marginBottom: 18, display: "flex", alignItems: "flex-start", gap: 10 }}>
          <span className="material-symbols-outlined" style={{ fontSize: 18, color: "#f87171", flexShrink: 0, marginTop: 1 }}>error</span>
          <span style={{ fontSize: 13, color: "#f87171", flex: 1 }}>{error}</span>
          <button onClick={() => setError("")} style={{ color: "#f87171", opacity: 0.6, flexShrink: 0 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>close</span>
          </button>
        </div>
      )}

      {/* STEP 1: Service Type */}
      <div className={`db-card anim-fade-in ${step === 1 ? "" : "booking-step-done"}`} style={{ marginBottom: 16, opacity: step >= 1 ? 1 : 0.4 }}>
        <div className="booking-step-header">
          <div className="booking-step-num" data-active={step === 1}>1</div>
          <span className="booking-step-title">Tipo de sessão</span>
          {tipo && step > 1 && (
            <button onClick={() => { setStep(1); setTipo(""); }} className="booking-edit-btn">Alterar</button>
          )}
        </div>

        {step === 1 ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12, marginTop: 16 }}>
            {tipoOptions.map((t) => (
              <button
                key={t.value}
                onClick={() => { setTipo(t.value); setStep(2); }}
                className="booking-option-card"
                data-selected={tipo === t.value}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 26 }}>{t.icon}</span>
                <span className="booking-option-label">{t.label}</span>
                <span className="booking-option-desc">{t.desc}</span>
              </button>
            ))}
          </div>
        ) : tipo ? (
          <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 8 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 16, color: "var(--primary)" }}>
              {tipoOptions.find(t => t.value === tipo)?.icon}
            </span>
            <span style={{ fontSize: 13, color: "var(--text2)" }}>
              {tipoOptions.find(t => t.value === tipo)?.label}
            </span>
          </div>
        ) : null}
      </div>

      {/* STEP 2: Date */}
      <div className={`db-card anim-fade-in ${step < 2 ? "booking-step-locked" : step === 2 ? "" : "booking-step-done"}`} style={{ marginBottom: 16 }}>
        <div className="booking-step-header">
          <div className="booking-step-num" data-active={step === 2}>2</div>
          <span className="booking-step-title">Data</span>
          {data && step > 2 && (
            <button onClick={() => { setStep(2); setData(""); setSelectedSlot(""); }} className="booking-edit-btn">Alterar</button>
          )}
        </div>

        {step === 2 ? (
          <div style={{ marginTop: 16 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6 }}>
              {days.map((day) => {
                const dateStr = format(day, "yyyy-MM-dd");
                const isSelected = data === dateStr;
                const isWeekend = day.getDay() === 0 || day.getDay() === 6;
                return (
                  <button
                    key={dateStr}
                    onClick={() => { setData(dateStr); setStep(3); }}
                    disabled={isWeekend}
                    className="booking-date-btn"
                    data-selected={isSelected}
                    data-disabled={isWeekend}
                  >
                    <span className="booking-date-day">{format(day, "EEE", { locale: pt })}</span>
                    <span className="booking-date-num">{format(day, "d")}</span>
                    <span className="booking-date-month">{format(day, "MMM", { locale: pt })}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : data ? (
          <div style={{ marginTop: 10, fontSize: 13, color: "var(--text2)" }}>
            <span className="material-symbols-outlined" style={{ fontSize: 14, verticalAlign: "middle", marginRight: 6, color: "var(--primary)" }}>calendar_today</span>
            {format(new Date(data + "T12:00:00"), "EEEE, d 'de' MMMM", { locale: pt })}
          </div>
        ) : null}
      </div>

      {/* STEP 3: Time Slot */}
      <div className={`db-card anim-fade-in ${step < 3 ? "booking-step-locked" : step === 3 ? "" : "booking-step-done"}`} style={{ marginBottom: 16 }}>
        <div className="booking-step-header">
          <div className="booking-step-num" data-active={step === 3}>3</div>
          <span className="booking-step-title">Horário</span>
          {selectedSlot && step > 3 && (
            <button onClick={() => { setStep(3); setSelectedSlot(""); }} className="booking-edit-btn">Alterar</button>
          )}
        </div>

        {step === 3 ? (
          <div style={{ marginTop: 16 }}>
            {slotsLoading ? (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "32px 0", gap: 10 }}>
                <div className="booking-spinner" />
                <span style={{ fontSize: 12, color: "var(--text3)" }}>A carregar horários...</span>
              </div>
            ) : slots.length > 0 ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
                {slots.map(slot => (
                  <button
                    key={slot}
                    onClick={() => { setSelectedSlot(slot); setStep(4); }}
                    className="booking-slot-btn"
                    data-selected={selectedSlot === slot}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 14 }}>schedule</span>
                    <span>{slot}</span>
                  </button>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "28px 0", color: "var(--text3)", fontSize: 13 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 28, display: "block", marginBottom: 8, opacity: 0.4 }}>event_busy</span>
                Sem horários disponíveis nesta data
              </div>
            )}
          </div>
        ) : selectedSlot ? (
          <div style={{ marginTop: 10, fontSize: 13, color: "var(--text2)" }}>
            <span className="material-symbols-outlined" style={{ fontSize: 14, verticalAlign: "middle", marginRight: 6, color: "var(--primary)" }}>schedule</span>
            {selectedSlot} ({duracao} min)
          </div>
        ) : null}
      </div>

      {/* STEP 4: Producer */}
      <div className={`db-card anim-fade-in ${step < 4 ? "booking-step-locked" : ""}`} style={{ marginBottom: 16 }}>
        <div className="booking-step-header">
          <div className="booking-step-num" data-active={step === 4}>4</div>
          <span className="booking-step-title">Produtor</span>
        </div>

        {step >= 4 ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginTop: 16 }}>
            {produtores.map((p) => (
              <button
                key={p.name}
                onClick={() => setProdutor(p.name)}
                className="booking-producer-btn"
                data-selected={produtor === p.name}
              >
                <div className="booking-producer-avatar">
                  {p.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                </div>
                <span className="booking-producer-name">{p.name}</span>
                <span className="booking-producer-role">{p.role}</span>
              </button>
            ))}
          </div>
        ) : null}
      </div>

      {/* Confirm button */}
      {step >= 4 && produtor && (
        <div className="db-card red-glow anim-fade-in" style={{ borderColor: "rgba(139,0,0,.25)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ fontSize: 11, color: "var(--text3)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 6 }}>Resumo da sessão</div>
              <div style={{ fontSize: 14, color: "var(--text)", fontWeight: 500 }}>
                {tipoOptions.find(t => t.value === tipo)?.label} • {format(new Date(data + "T12:00:00"), "d MMM", { locale: pt })} • {selectedSlot} • {produtor}
              </div>
            </div>
            <button onClick={handleBook} disabled={loading} className="marcar-cta" style={{ width: "auto", marginTop: 0, padding: "14px 32px", opacity: loading ? 0.6 : 1 }}>
              {loading ? (
                <><div className="booking-spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> A marcar...</>
              ) : (
                <><span className="material-symbols-outlined" style={{ fontSize: 18 }}>check_circle</span> Confirmar Sessão</>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Inline styles for booking-specific elements */}
      <style dangerouslySetInnerHTML={{ __html: `
        .booking-step-header {
          display: flex; align-items: center; gap: 10px;
        }
        .booking-step-num {
          width: 28px; height: 28px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 11px; font-weight: 700; flex-shrink: 0;
          background: rgba(255,255,255,.04); border: 1px solid var(--border);
          color: var(--text3); transition: all .3s;
        }
        .booking-step-num[data-active="true"] {
          background: rgba(139,0,0,.15); border-color: rgba(139,0,0,.4);
          color: var(--primary); box-shadow: 0 0 12px rgba(139,0,0,.2);
        }
        .booking-step-title {
          font-size: 13px; font-weight: 600; color: var(--text);
          letter-spacing: .04em;
        }
        .booking-edit-btn {
          margin-left: auto; font-size: 11px; color: var(--primary);
          cursor: pointer; opacity: 0.7; transition: opacity .2s;
          background: none; border: none;
        }
        .booking-edit-btn:hover { opacity: 1; }
        .booking-step-locked { opacity: 0.35; pointer-events: none; }
        .booking-step-done { }

        .booking-option-card {
          display: flex; flex-direction: column; align-items: center; gap: 8px;
          padding: 20px 12px; border-radius: 12px; cursor: pointer;
          background: rgba(255,255,255,.02); border: 1px solid var(--border);
          color: var(--text3); transition: all .25s ease;
        }
        .booking-option-card:hover {
          border-color: rgba(139,0,0,.3); color: var(--text);
          background: rgba(139,0,0,.04); transform: translateY(-2px);
        }
        .booking-option-card[data-selected="true"] {
          background: rgba(139,0,0,.1); border-color: rgba(139,0,0,.5);
          color: var(--primary); box-shadow: 0 4px 20px rgba(139,0,0,.15);
        }
        .booking-option-label {
          font-size: 12px; font-weight: 600; letter-spacing: .06em;
        }
        .booking-option-desc {
          font-size: 10px; opacity: 0.6;
        }

        .booking-date-btn {
          display: flex; flex-direction: column; align-items: center; gap: 2px;
          padding: 10px 4px; border-radius: 10px; cursor: pointer;
          background: transparent; border: 1px solid var(--border);
          color: var(--text2); transition: all .2s;
        }
        .booking-date-btn:hover:not([data-disabled="true"]) {
          border-color: rgba(139,0,0,.3); background: rgba(139,0,0,.04);
        }
        .booking-date-btn[data-selected="true"] {
          background: rgba(139,0,0,.2); border-color: var(--primary-c);
          color: #fff; box-shadow: 0 0 16px rgba(139,0,0,.25);
          font-weight: 700;
        }
        .booking-date-btn[data-disabled="true"] {
          opacity: 0.15; cursor: not-allowed;
        }
        .booking-date-day { font-size: 9px; text-transform: uppercase; color: var(--text3); }
        .booking-date-num { font-size: 16px; font-weight: 600; }
        .booking-date-month { font-size: 9px; color: var(--text3); }

        .booking-slot-btn {
          display: flex; align-items: center; justify-content: center; gap: 6px;
          padding: 12px 8px; border-radius: 10px; cursor: pointer;
          background: rgba(255,255,255,.02); border: 1px solid var(--border);
          color: var(--text2); font-size: 14px; font-weight: 500;
          transition: all .2s;
        }
        .booking-slot-btn:hover {
          border-color: rgba(139,0,0,.3); background: rgba(139,0,0,.04);
          color: var(--text);
        }
        .booking-slot-btn[data-selected="true"] {
          background: var(--primary-c); border-color: var(--primary-c);
          color: #fff; box-shadow: 0 4px 16px rgba(139,0,0,.3);
        }

        .booking-producer-btn {
          display: flex; flex-direction: column; align-items: center; gap: 6px;
          padding: 18px 10px; border-radius: 12px; cursor: pointer;
          background: rgba(255,255,255,.02); border: 1px solid var(--border);
          color: var(--text3); transition: all .25s;
        }
        .booking-producer-btn:hover {
          border-color: rgba(139,0,0,.3); background: rgba(139,0,0,.04);
          color: var(--text); transform: translateY(-2px);
        }
        .booking-producer-btn[data-selected="true"] {
          background: rgba(139,0,0,.1); border-color: rgba(139,0,0,.5);
          color: var(--primary); box-shadow: 0 4px 20px rgba(139,0,0,.15);
        }
        .booking-producer-avatar {
          width: 36px; height: 36px; border-radius: 50%;
          background: linear-gradient(135deg, var(--primary-c), #c41a1a);
          display: flex; align-items: center; justify-content: center;
          font-size: 11px; font-weight: 700; color: #fff;
        }
        .booking-producer-name { font-size: 12px; font-weight: 600; }
        .booking-producer-role { font-size: 9px; opacity: 0.6; letter-spacing: .08em; text-transform: uppercase; }

        .booking-spinner {
          width: 18px; height: 18px; border: 2px solid var(--border);
          border-top-color: var(--primary); border-radius: 50%;
          animation: spin .7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .wavy-check-circle {
          width: 72px; height: 72px; border-radius: 50%;
          background: rgba(34,197,94,.08); border: 2px solid rgba(34,197,94,.2);
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto; animation: check-pop .5s cubic-bezier(.4,0,.2,1);
        }
        @keyframes check-pop {
          0% { transform: scale(0); opacity: 0; }
          60% { transform: scale(1.15); }
          100% { transform: scale(1); opacity: 1; }
        }

        .anim-fade-in {
          animation: anim-fi .4s ease both;
        }
        @keyframes anim-fi {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: none; }
        }

        @media (max-width: 640px) {
          .booking-option-card { padding: 14px 8px; }
          .booking-date-btn { padding: 8px 2px; }
          .booking-slot-btn { padding: 10px 6px; font-size: 13px; }
          .booking-producer-btn { padding: 14px 6px; }
        }
      `}} />
    </div>
  );
}
