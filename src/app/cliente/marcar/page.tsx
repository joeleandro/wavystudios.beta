"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { format, addDays } from "date-fns";
import { pt } from "date-fns/locale";

export default function ClienteMarcarPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [tipo, setTipo] = useState("captacao");
  const [data, setData] = useState("");
  const [slots, setSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [loading, setLoading] = useState(false);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [duracao, setDuracao] = useState(60);

  const today = new Date();
  const days = Array.from({ length: 14 }, (_, i) => addDays(today, i + 1));

  // Fetch plan duration on mount
  useEffect(() => {
    fetch("/api/stats")
      .then(r => r.json())
      .then(d => {
        if (d.weekly?.duracao_sessao) setDuracao(d.weekly.duracao_sessao);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (data) fetchSlots();
  }, [data, duracao]);

  async function fetchSlots() {
    setSelectedSlot("");
    setSlotsLoading(true);
    try {
      const res = await fetch(`/api/sessoes?data=${data}&slots=true&duracao=${duracao}`);
      if (res.ok) {
        const result = await res.json();
        setSlots(result.slots || []);
      }
    } catch {}
    setSlotsLoading(false);
  }

  async function handleBook() {
    setLoading(true);
    setError("");
    const res = await fetch("/api/sessoes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tipo, data, hora_inicio: selectedSlot }),
    });
    const result = await res.json();
    setLoading(false);
    if (!res.ok) { setError(result.error); return; }
    setSuccess(result.message);
    setTimeout(() => router.push("/cliente/sessoes"), 2000);
  }

  const tipoOptions = [
    { value: "captacao", label: "Captação", icon: "mic" },
    { value: "mix_master", label: "Mix/Master", icon: "tune" },
    { value: "foto", label: "Fotografia", icon: "photo_camera" },
    { value: "outro", label: "Outro", icon: "music_note" },
  ];

  return (
    <div style={{ maxWidth: 720 }}>
      <div style={{ marginBottom: 26 }}>
        <div className="db-page-title bebas">Marcar Sessão</div>
        <div className="db-page-sub">Escolhe o tipo, data e horário &bull; Sessões de {duracao}min</div>
      </div>

      {success ? (
        <div className="db-card red-glow" style={{ textAlign: "center", padding: "48px 32px" }}>
          <div style={{ width: 56, height: 56, background: "rgba(34,197,94,.12)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <span className="material-symbols-outlined" style={{ fontSize: 28, color: "#4ade80" }}>check_circle</span>
          </div>
          <div style={{ fontSize: 18, fontWeight: 500, color: "var(--text)", marginBottom: 8 }}>{success}</div>
          <div style={{ fontSize: 13, color: "var(--text3)" }}>A sessão fica pendente até confirmação do admin.</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Step 1: Type */}
          <div className="db-card">
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <div style={{ width: 24, height: 24, background: "rgba(139,0,0,.15)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "var(--primary)", fontWeight: 700 }}>1</div>
              <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: ".15em", textTransform: "uppercase", color: "var(--text)" }}>Tipo de Sessão</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
              {tipoOptions.map((t) => (
                <button
                  key={t.value}
                  onClick={() => { setTipo(t.value); setStep(2); }}
                  style={{
                    padding: "16px 8px", borderRadius: 10, textAlign: "center", transition: "all .2s", cursor: "pointer",
                    background: tipo === t.value ? "rgba(139,0,0,.1)" : "rgba(255,255,255,.02)",
                    border: tipo === t.value ? "1px solid rgba(139,0,0,.35)" : "1px solid var(--border)",
                    color: tipo === t.value ? "var(--primary)" : "var(--text3)",
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 20, display: "block", marginBottom: 6 }}>{t.icon}</span>
                  <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: ".15em", textTransform: "uppercase" }}>{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Date */}
          <div className="db-card" style={{ opacity: step < 2 ? 0.4 : 1, pointerEvents: step < 2 ? "none" : "auto", transition: "opacity .3s" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <div style={{ width: 24, height: 24, background: "rgba(139,0,0,.15)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "var(--primary)", fontWeight: 700 }}>2</div>
              <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: ".15em", textTransform: "uppercase", color: "var(--text)" }}>Escolher Data</span>
            </div>
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
                    style={{
                      padding: "10px 4px", borderRadius: 8, textAlign: "center", cursor: isWeekend ? "not-allowed" : "pointer",
                      opacity: isWeekend ? 0.2 : 1,
                      background: isSelected ? "rgba(139,0,0,.15)" : "transparent",
                      border: isSelected ? "1px solid rgba(139,0,0,.4)" : "1px solid var(--border)",
                      color: isSelected ? "var(--primary)" : "var(--text2)",
                      transition: "all .15s",
                    }}
                  >
                    <div style={{ fontSize: 9, color: "var(--text3)", textTransform: "uppercase" }}>{format(day, "EEE", { locale: pt })}</div>
                    <div style={{ fontSize: 16, fontWeight: 500, marginTop: 2 }}>{format(day, "d")}</div>
                    <div style={{ fontSize: 9, color: "var(--text3)" }}>{format(day, "MMM", { locale: pt })}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 3: Time slots */}
          <div className="db-card" style={{ opacity: step < 3 ? 0.4 : 1, pointerEvents: step < 3 ? "none" : "auto", transition: "opacity .3s" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <div style={{ width: 24, height: 24, background: "rgba(139,0,0,.15)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "var(--primary)", fontWeight: 700 }}>3</div>
              <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: ".15em", textTransform: "uppercase", color: "var(--text)" }}>Horário Disponível</span>
            </div>
            {slotsLoading ? (
              <div style={{ textAlign: "center", padding: "32px 0", color: "var(--text3)", fontSize: 12 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 20, display: "block", marginBottom: 8, animation: "wf-rot 1s linear infinite" }}>sync</span>
                A carregar horários...
              </div>
            ) : slots.length > 0 ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 6 }}>
                {slots.map(slot => (
                  <button
                    key={slot}
                    onClick={() => setSelectedSlot(slot)}
                    style={{
                      padding: "10px 4px", borderRadius: 8, fontSize: 13, textAlign: "center", cursor: "pointer",
                      background: selectedSlot === slot ? "var(--primary-c)" : "transparent",
                      border: selectedSlot === slot ? "1px solid var(--primary-c)" : "1px solid var(--border)",
                      color: selectedSlot === slot ? "#fff" : "var(--text2)",
                      boxShadow: selectedSlot === slot ? "0 0 20px rgba(139,0,0,.3)" : "none",
                      transition: "all .15s",
                    }}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            ) : data ? (
              <div style={{ textAlign: "center", padding: "32px 0", color: "var(--text3)", fontSize: 12 }}>Sem horários disponíveis neste dia</div>
            ) : null}
          </div>

          {/* Error */}
          {error && (
            <div style={{ background: "rgba(239,68,68,.08)", border: "1px solid rgba(239,68,68,.2)", borderRadius: 10, padding: "12px 16px" }}>
              <div style={{ fontSize: 13, color: "#f87171" }}>{error}</div>
            </div>
          )}

          {/* Confirm */}
          {selectedSlot && (
            <div className="db-card red-glow" style={{ borderColor: "rgba(139,0,0,.3)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: "var(--text)" }}>Confirmar marcação</div>
                  <div style={{ fontSize: 12, color: "var(--text3)", marginTop: 4 }}>{tipo} &bull; {data} &bull; {selectedSlot} &bull; {duracao}min</div>
                </div>
                <button
                  onClick={handleBook}
                  disabled={loading}
                  className="marcar-cta"
                  style={{ width: "auto", marginTop: 0, padding: "12px 24px", opacity: loading ? 0.5 : 1 }}
                >
                  {loading ? "A marcar..." : "Confirmar"}
                </button>
              </div>
            </div>
          )}

          {/* Rules */}
          <div style={{ border: "1px solid var(--border)", borderRadius: 10, padding: "14px 18px" }}>
            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".15em", textTransform: "uppercase", color: "var(--text3)", marginBottom: 8 }}>Lembrete</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,.3)", lineHeight: 1.8 }}>
              &bull; Horas não acumulam entre semanas<br />
              &bull; Sessões canceladas não podem ser remarcadas<br />
              &bull; Sem reembolsos em nenhuma circunstância
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
