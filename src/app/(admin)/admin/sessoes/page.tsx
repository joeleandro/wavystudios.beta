"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { UploadModal } from "@/components/admin/upload-modal";
import { formatDateShort } from "@/lib/utils/formatDate";

type Sessao = {
  id: string;
  data: string;
  hora_inicio: string;
  hora_fim: string;
  tipo: string;
  estado: string;
  duracao_minutos: number;
  produtor?: string | null;
  cliente_id: string;
  profiles?: { nome?: string };
};

export default function AdminSessoesPage() {
  const [sessoes, setSessoes] = useState<Sessao[]>([]);
  const [filter, setFilter] = useState("todas");
  const [primeiroNome, setPrimeiroNome] = useState("Admin");
  const [uploadTarget, setUploadTarget] = useState<{ sessaoId: string; clienteId: string; clienteNome: string } | null>(null);
  const supabase = createClient();

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: prof } = await supabase
        .from("profiles")
        .select("nome")
        .eq("id", user.id)
        .single();
      setPrimeiroNome(
        prof?.nome?.split(" ")[0] ||
        user.email?.split("@")[0] ||
        "Admin"
      );
    }
    const { data } = await supabase
      .from("sessoes")
      .select("*, profiles(nome)")
      .order("data", { ascending: true })
      .order("hora_inicio");
    setSessoes((data as Sessao[]) || []);
  }

  async function handleAction(id: string, estado: string) {
    await fetch("/api/sessoes", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessao_id: id, estado }),
    });
    loadData();
  }

  const todayStr = new Date().toISOString().split("T")[0];
  const filtered = filter === "todas" ? sessoes : sessoes.filter((s) => s.estado === filter);
  const filters = ["todas", "pendente", "confirmada", "concluida", "recusada", "cancelada"];

  // Horizontal columns: Pending / Today / Upcoming
  const pending = sessoes.filter((s) => s.estado === "pendente");
  const today = sessoes.filter((s) => s.data === todayStr && s.estado !== "cancelada" && s.estado !== "recusada");
  const upcoming = sessoes.filter(
    (s) => s.data > todayStr && (s.estado === "confirmada" || s.estado === "pendente")
  );

  const renderSessionRow = (s: Sessao, mode: "compact" | "actions") => (
    <div
      key={s.id}
      style={{
        padding: "12px 14px",
        background: "rgba(255,255,255,.02)",
        borderRadius: 10,
        border: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {s.profiles?.nome || "Cliente"}
          </div>
          <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 2 }}>
            {formatDateShort(s.data)} • {s.hora_inicio}–{s.hora_fim}
          </div>
          <div style={{ fontSize: 10, color: "var(--text3)", marginTop: 2, textTransform: "capitalize" }}>
            {s.tipo?.replace("_", "/")}
            {s.produtor ? ` • ${s.produtor}` : ""}
          </div>
        </div>
        <span
          className={`status-pill ${
            s.estado === "confirmada"
              ? "sp-ok"
              : s.estado === "pendente"
              ? "sp-pend"
              : s.estado === "recusada" || s.estado === "cancelada"
              ? "sp-cancel"
              : "sp-done"
          }`}
        >
          {s.estado}
        </span>
      </div>
      {mode === "actions" && s.estado === "pendente" && (
        <div style={{ display: "flex", gap: 6 }}>
          <button
            onClick={() => handleAction(s.id, "confirmada")}
            style={{
              flex: 1,
              fontSize: 10,
              padding: "6px 10px",
              background: "rgba(34,197,94,.1)",
              border: "1px solid rgba(34,197,94,.2)",
              borderRadius: 6,
              color: "#4ade80",
              cursor: "pointer",
              letterSpacing: ".1em",
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            Confirmar
          </button>
          <button
            onClick={() => handleAction(s.id, "recusada")}
            style={{
              flex: 1,
              fontSize: 10,
              padding: "6px 10px",
              background: "rgba(239,68,68,.1)",
              border: "1px solid rgba(239,68,68,.2)",
              borderRadius: 6,
              color: "#f87171",
              cursor: "pointer",
              letterSpacing: ".1em",
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            Recusar
          </button>
        </div>
      )}
      {mode === "actions" && s.estado === "confirmada" && (
        <button
          onClick={() => handleAction(s.id, "concluida")}
          style={{
            fontSize: 10,
            padding: "6px 10px",
            background: "rgba(59,130,246,.1)",
            border: "1px solid rgba(59,130,246,.2)",
            borderRadius: 6,
            color: "#60a5fa",
            cursor: "pointer",
            letterSpacing: ".1em",
            textTransform: "uppercase",
            fontWeight: 600,
          }}
        >
          Concluir
        </button>
      )}
      {mode === "actions" && s.estado === "concluida" && (
        <button
          onClick={() => setUploadTarget({ sessaoId: s.id, clienteId: (s as any).cliente_id, clienteNome: s.profiles?.nome || "Cliente" })}
          style={{
            fontSize: 10,
            padding: "6px 10px",
            background: "rgba(139,0,0,.1)",
            border: "1px solid rgba(139,0,0,.2)",
            borderRadius: 6,
            color: "var(--primary)",
            cursor: "pointer",
            letterSpacing: ".1em",
            textTransform: "uppercase",
            fontWeight: 600,
            display: "flex", alignItems: "center", gap: 4,
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 12 }}>upload_file</span>
          Enviar Ficheiro
        </button>
      )}
    </div>
  );

  return (
    <div style={{ maxWidth: 1400 }}>
      <div style={{ marginBottom: 26 }}>
        <div className="db-page-title bebas">Olá, {primeiroNome} 👋</div>
        <div className="db-page-sub">{sessoes.length} sessões totais • Gestão de marcações</div>
      </div>

      {/* Horizontal columns layout (PC): Pending / Today / Upcoming */}
      <div className="admin-booking-grid">
        <div className="db-card">
          <div className="db-card-label">
            <div className="dot" />Pendentes <span style={{ marginLeft: "auto", color: "var(--primary)" }}>{pending.length}</span>
          </div>
          <div className="admin-booking-list">
            {pending.length > 0 ? (
              pending.map((s) => renderSessionRow(s, "actions"))
            ) : (
              <div style={{ textAlign: "center", padding: "32px 0", color: "var(--text3)", fontSize: 12 }}>
                Sem sessões pendentes
              </div>
            )}
          </div>
        </div>

        <div className="db-card">
          <div className="db-card-label">
            <div className="dot" />Hoje <span style={{ marginLeft: "auto", color: "var(--primary)" }}>{today.length}</span>
          </div>
          <div className="admin-booking-list">
            {today.length > 0 ? (
              today.map((s) => renderSessionRow(s, "actions"))
            ) : (
              <div style={{ textAlign: "center", padding: "32px 0", color: "var(--text3)", fontSize: 12 }}>
                Sem sessões hoje
              </div>
            )}
          </div>
        </div>

        <div className="db-card">
          <div className="db-card-label">
            <div className="dot" />Próximas <span style={{ marginLeft: "auto", color: "var(--primary)" }}>{upcoming.length}</span>
          </div>
          <div className="admin-booking-list">
            {upcoming.length > 0 ? (
              upcoming.slice(0, 30).map((s) => renderSessionRow(s, "compact"))
            ) : (
              <div style={{ textAlign: "center", padding: "32px 0", color: "var(--text3)", fontSize: 12 }}>
                Sem sessões marcadas
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Full sessions table with filters */}
      <div style={{ marginTop: 24 }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: ".15em",
                textTransform: "uppercase",
                padding: "8px 16px",
                borderRadius: 8,
                cursor: "pointer",
                background: filter === f ? "rgba(139,0,0,.15)" : "transparent",
                border: filter === f ? "1px solid rgba(139,0,0,.3)" : "1px solid var(--border)",
                color: filter === f ? "var(--primary)" : "var(--text3)",
                transition: "all .2s",
              }}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="db-card">
          <table className="db-table">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Data</th>
                <th>Hora</th>
                <th>Tipo</th>
                <th>Duração</th>
                <th>Produtor</th>
                <th>Estado</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id}>
                  <td style={{ color: "var(--text)", fontWeight: 500 }}>{s.profiles?.nome || "—"}</td>
                  <td>{formatDateShort(s.data)}</td>
                  <td>{s.hora_inicio}–{s.hora_fim}</td>
                  <td style={{ textTransform: "capitalize" }}>{s.tipo?.replace("_", "/")}</td>
                  <td>{s.duracao_minutos}min</td>
                  <td>{s.produtor || "—"}</td>
                  <td>
                    <span
                      className={`status-pill ${
                        s.estado === "confirmada"
                          ? "sp-ok"
                          : s.estado === "pendente"
                          ? "sp-pend"
                          : s.estado === "recusada" || s.estado === "cancelada"
                          ? "sp-cancel"
                          : "sp-done"
                      }`}
                    >
                      {s.estado}
                    </span>
                  </td>
                  <td>
                    {s.estado === "pendente" && (
                      <div style={{ display: "flex", gap: 4 }}>
                        <button
                          onClick={() => handleAction(s.id, "confirmada")}
                          style={{
                            fontSize: 9,
                            padding: "4px 10px",
                            background: "rgba(34,197,94,.1)",
                            border: "1px solid rgba(34,197,94,.2)",
                            borderRadius: 4,
                            color: "#4ade80",
                            cursor: "pointer",
                          }}
                        >
                          Confirmar
                        </button>
                        <button
                          onClick={() => handleAction(s.id, "recusada")}
                          style={{
                            fontSize: 9,
                            padding: "4px 10px",
                            background: "rgba(239,68,68,.1)",
                            border: "1px solid rgba(239,68,68,.2)",
                            borderRadius: 4,
                            color: "#f87171",
                            cursor: "pointer",
                          }}
                        >
                          Recusar
                        </button>
                      </div>
                    )}
                    {s.estado === "confirmada" && (
                      <button
                        onClick={() => handleAction(s.id, "concluida")}
                        style={{
                          fontSize: 9,
                          padding: "4px 10px",
                          background: "rgba(59,130,246,.1)",
                          border: "1px solid rgba(59,130,246,.2)",
                          borderRadius: 4,
                          color: "#60a5fa",
                          cursor: "pointer",
                        }}
                      >
                        Concluir
                      </button>
                    )}
                    {s.estado === "concluida" && (
                      <button
                        onClick={() => setUploadTarget({ sessaoId: s.id, clienteId: s.cliente_id, clienteNome: s.profiles?.nome || "Cliente" })}
                        style={{
                          fontSize: 9,
                          padding: "4px 10px",
                          background: "rgba(139,0,0,.1)",
                          border: "1px solid rgba(139,0,0,.2)",
                          borderRadius: 4,
                          color: "var(--primary)",
                          cursor: "pointer",
                          display: "flex", alignItems: "center", gap: 3,
                        }}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: 11 }}>upload_file</span>
                        Enviar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: "32px 0", color: "var(--text3)", fontSize: 12 }}>
              Sem sessões
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {uploadTarget && (
        <UploadModal
          sessaoId={uploadTarget.sessaoId}
          clienteId={uploadTarget.clienteId}
          clienteNome={uploadTarget.clienteNome}
          onClose={() => setUploadTarget(null)}
          onSuccess={() => loadData()}
        />
      )}
    </div>
  );
}
