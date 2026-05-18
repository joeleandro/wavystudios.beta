"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { format, addDays, startOfWeek } from "date-fns";
import { pt } from "date-fns/locale";

export default function ClienteMarcarPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [tipo, setTipo] = useState("captacao");
  const [data, setData] = useState("");
  const [slots, setSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Generate next 14 days
  const today = new Date();
  const days = Array.from({ length: 14 }, (_, i) => addDays(today, i + 1));

  useEffect(() => {
    if (data) {
      fetchSlots();
    }
  }, [data]);

  async function fetchSlots() {
    setSelectedSlot("");
    const res = await fetch(`/api/sessoes?data=${data}&slots=true`);
    if (res.ok) {
      const result = await res.json();
      setSlots(result.slots);
    }
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

    if (!res.ok) {
      setError(result.error);
      return;
    }

    setSuccess(result.message);
    setTimeout(() => router.push("/cliente/sessoes"), 2000);
  }

  return (
    <div className="max-w-[700px] mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-headline">Marcar Sessão</h1>
        <p className="text-sm text-label-opacity mt-0.5">Escolhe o tipo, data e horário</p>
      </div>

      {success ? (
        <div className="glass-card rounded-2xl p-8 text-center space-y-4">
          <div className="w-16 h-16 bg-green-900/20 rounded-full flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-green-400 text-3xl">check_circle</span>
          </div>
          <h3 className="text-lg text-headline">{success}</h3>
          <p className="text-sm text-label-opacity">A sessão fica pendente até confirmação do admin.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Step 1: Type */}
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-6 h-6 bg-primary-container/20 rounded-full flex items-center justify-center text-[10px] text-primary font-bold">1</span>
              <h3 className="text-sm font-medium text-headline uppercase tracking-wider">Tipo de Sessão</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { value: "captacao", label: "Captação", icon: "mic" },
                { value: "mix_master", label: "Mix/Master", icon: "tune" },
                { value: "foto", label: "Fotografia", icon: "photo_camera" },
                { value: "outro", label: "Outro", icon: "music_note" },
              ].map((t) => (
                <button
                  key={t.value}
                  onClick={() => { setTipo(t.value); setStep(2); }}
                  className={`p-4 rounded-xl border text-center transition-all ${
                    tipo === t.value
                      ? "bg-primary-container/10 border-primary-container/30 text-primary"
                      : "border-white/5 text-label-opacity hover:border-white/20 hover:text-white"
                  }`}
                >
                  <span className="material-symbols-outlined text-lg block mb-2">{t.icon}</span>
                  <span className="text-[10px] uppercase tracking-wider">{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Date */}
          <div className={`glass-card rounded-2xl p-6 transition-opacity ${step < 2 ? "opacity-40 pointer-events-none" : ""}`}>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-6 h-6 bg-primary-container/20 rounded-full flex items-center justify-center text-[10px] text-primary font-bold">2</span>
              <h3 className="text-sm font-medium text-headline uppercase tracking-wider">Escolher Data</h3>
            </div>
            <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
              {days.map((day) => {
                const dateStr = format(day, "yyyy-MM-dd");
                const isSelected = data === dateStr;
                const isWeekend = day.getDay() === 0 || day.getDay() === 6;
                return (
                  <button
                    key={dateStr}
                    onClick={() => { setData(dateStr); setStep(3); }}
                    disabled={isWeekend}
                    className={`p-3 rounded-xl text-center transition-all ${
                      isWeekend
                        ? "opacity-20 cursor-not-allowed border border-white/5"
                        : isSelected
                        ? "bg-primary-container/20 border border-primary-container/40 text-primary"
                        : "border border-white/5 text-label-opacity hover:text-white hover:border-white/20"
                    }`}
                  >
                    <span className="text-[9px] text-label-opacity uppercase block">
                      {format(day, "EEE", { locale: pt })}
                    </span>
                    <span className="text-lg font-medium block mt-1">{format(day, "d")}</span>
                    <span className="text-[9px] text-label-opacity block">
                      {format(day, "MMM", { locale: pt })}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 3: Time slots */}
          <div className={`glass-card rounded-2xl p-6 transition-opacity ${step < 3 ? "opacity-40 pointer-events-none" : ""}`}>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-6 h-6 bg-primary-container/20 rounded-full flex items-center justify-center text-[10px] text-primary font-bold">3</span>
              <h3 className="text-sm font-medium text-headline uppercase tracking-wider">Horário Disponível</h3>
            </div>
            {slots.length > 0 ? (
              <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                {slots.map(slot => (
                  <button
                    key={slot}
                    onClick={() => setSelectedSlot(slot)}
                    className={`py-3 px-2 rounded-lg text-sm text-center transition-all ${
                      selectedSlot === slot
                        ? "bg-primary-container text-white burgundy-glow"
                        : "border border-white/10 text-label-opacity hover:text-white hover:border-primary-container/30"
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            ) : data ? (
              <p className="text-sm text-label-opacity text-center py-8">A carregar horários...</p>
            ) : null}
          </div>

          {/* Error */}
          {error && (
            <div className="bg-error-container/10 border border-error-container/20 rounded-xl p-4">
              <p className="text-sm text-error">{error}</p>
            </div>
          )}

          {/* Confirm */}
          {selectedSlot && (
            <div className="glass-card rounded-2xl p-6 burgundy-glow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-headline font-medium">Confirmar marcação</p>
                  <p className="text-xs text-label-opacity mt-1">
                    {tipo} • {data} • {selectedSlot}
                  </p>
                </div>
                <button
                  onClick={handleBook}
                  disabled={loading}
                  className="bg-primary-container hover:bg-primary-container/80 text-white px-6 py-3 rounded-lg text-xs font-semibold uppercase tracking-[0.15em] transition-all disabled:opacity-50"
                >
                  {loading ? "A marcar..." : "Confirmar"}
                </button>
              </div>
            </div>
          )}

          {/* Rules reminder */}
          <div className="border border-white/5 rounded-xl p-4 space-y-2">
            <p className="text-[10px] text-label-opacity uppercase tracking-wider font-semibold">Lembrete</p>
            <ul className="text-xs text-white/40 space-y-1">
              <li>• Horas não acumulam entre semanas</li>
              <li>• Sessões canceladas não podem ser remarcadas</li>
              <li>• Sem reembolsos em nenhuma circunstância</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
