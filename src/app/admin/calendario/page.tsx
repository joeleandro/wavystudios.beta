"use client";

import { useEffect, useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek, isSameDay, isSameMonth, addMonths, subMonths } from "date-fns";
import { pt } from "date-fns/locale";

interface Sessao {
  id: string;
  cliente_nome: string;
  tipo: string;
  data: string;
  hora_inicio: string;
  hora_fim: string;
  estado: string;
}

export default function AdminCalendarioPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [sessoes, setSessoes] = useState<Sessao[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => {
    fetchSessoes();
  }, []);

  async function fetchSessoes() {
    const res = await fetch("/api/sessoes");
    if (res.ok) {
      const data = await res.json();
      setSessoes(data.sessoes);
    }
  }

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const getSessionsForDay = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return sessoes.filter(s => s.data === dateStr);
  };

  const selectedSessions = selectedDate 
    ? sessoes.filter(s => s.data === selectedDate)
    : [];

  return (
    <div className="max-w-[1200px] mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-headline">Calendário</h1>
        <p className="text-sm text-label-opacity mt-0.5">Vista geral das sessões</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center text-label-opacity hover:text-white transition-colors">
              <span className="material-symbols-outlined text-sm">chevron_left</span>
            </button>
            <h3 className="text-lg font-medium text-headline capitalize">
              {format(currentMonth, "MMMM yyyy", { locale: pt })}
            </h3>
            <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center text-label-opacity hover:text-white transition-colors">
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </button>
          </div>

          {/* Week headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"].map(d => (
              <div key={d} className="text-center text-[10px] uppercase tracking-wider text-label-opacity py-2">
                {d}
              </div>
            ))}
          </div>

          {/* Days */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day) => {
              const daySessions = getSessionsForDay(day);
              const isCurrentMonth = isSameMonth(day, currentMonth);
              const isToday = isSameDay(day, new Date());
              const isSelected = selectedDate === format(day, "yyyy-MM-dd");
              
              return (
                <button
                  key={day.toISOString()}
                  onClick={() => setSelectedDate(format(day, "yyyy-MM-dd"))}
                  className={`aspect-square p-1 rounded-lg text-sm relative flex flex-col items-center justify-start pt-2 transition-all ${
                    !isCurrentMonth ? "text-white/15" :
                    isSelected ? "bg-primary-container/20 border border-primary-container/40 text-headline" :
                    isToday ? "bg-white/5 border border-white/10 text-headline" :
                    "text-label-opacity hover:bg-white/5"
                  }`}
                >
                  <span className="text-xs">{format(day, "d")}</span>
                  {daySessions.length > 0 && isCurrentMonth && (
                    <div className="flex gap-0.5 mt-1">
                      {daySessions.slice(0, 3).map((_, i) => (
                        <div key={i} className="w-1 h-1 rounded-full bg-primary-container" />
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected day details */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-sm font-medium text-headline mb-1">
            {selectedDate 
              ? format(new Date(selectedDate), "d 'de' MMMM", { locale: pt })
              : "Selecione um dia"
            }
          </h3>
          <p className="text-xs text-label-opacity mb-6">
            {selectedSessions.length} sessões
          </p>

          <div className="space-y-3">
            {selectedSessions.map(s => (
              <div key={s.id} className="p-3 bg-surface-container/50 rounded-xl border border-white/5">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-headline">{s.cliente_nome}</span>
                  <span className={`text-[9px] px-2 py-0.5 rounded-full ${
                    s.estado === "confirmada" ? "bg-green-900/20 text-green-400" :
                    s.estado === "pendente" ? "bg-yellow-900/20 text-yellow-400" :
                    "bg-red-900/20 text-red-400"
                  }`}>{s.estado}</span>
                </div>
                <p className="text-xs text-label-opacity">
                  {s.hora_inicio} – {s.hora_fim} • {s.tipo}
                </p>
              </div>
            ))}
            {selectedDate && selectedSessions.length === 0 && (
              <p className="text-sm text-label-opacity text-center py-8">Sem sessões neste dia</p>
            )}
            {!selectedDate && (
              <p className="text-sm text-label-opacity text-center py-8">Clique num dia para ver detalhes</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
