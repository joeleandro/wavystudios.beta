"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
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
  cliente_id?: string;
  profiles?: { nome?: string };
};

export default function AdminSessoesPage() {
  const [sessoes, setSessoes] = useState<Sessao[]>([]);
  const [filter, setFilter] = useState("todas");
  const [primeiroNome, setPrimeiroNome] = useState("Admin");
  const [uploadModal, setUploadModal] = useState<Sessao | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadTipo, setUploadTipo] = useState("projecto_final");
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  async function handleUpload() {
    if (!uploadFile || !uploadModal) return;
    setUploading(true);
    setUploadMsg("");

    const clienteId = uploadModal.cliente_id || "";
    if (!clienteId) {
      setUploadMsg("Cliente inválido nesta sessão");
      setUploading(false);
      return;
    }

    try {
      // 1. Request a signed upload URL (small JSON request — no body limit issue)
      const params = new URLSearchParams({
        sessao_id: uploadModal.id,
        cliente_id: clienteId,
        filename: uploadFile.name,
      });
      const urlRes = await fetch(`/api/entregas/upload-url?${params.toString()}`);
      const urlData = await urlRes.json();
      if (!urlRes.ok) {
        setUploadMsg(urlData.error || "Erro ao preparar upload");
        setUploading(false);
        return;
      }

      // 2. Upload the file DIRECTLY to Supabase Storage (bypasses Vercel body limit)
      const { error: upErr } = await supabase.storage
        .from("wavy-entregas")
        .uploadToSignedUrl(urlData.path, urlData.token, uploadFile, {
          contentType: uploadFile.type || undefined,
        });
      if (upErr) {
        setUploadMsg("Erro no upload: " + upErr.message);
        setUploading(false);
        return;
      }

      // 3. Confirm — create the DB record + notify the client
      const confirmRes = await fetch("/api/entregas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessao_id: uploadModal.id,
          cliente_id: clienteId,
          tipo: uploadTipo,
          nome_ficheiro: uploadFile.name,
          storage_path: urlData.path,
          tamanho_bytes: uploadFile.size,
        }),
      });
      const confirmData = await confirmRes.json();
      if (confirmRes.ok) {
        setUploadMsg("Ficheiro enviado com sucesso!");
        setTimeout(() => { setUploadModal(null); setUploadFile(null); setUploadMsg(""); setUploadTipo("projecto_final"); }, 1500);
      } else {
        setUploadMsg(confirmData.error || "Erro ao registar entrega");
      }
    } catch (e) {
      setUploadMsg("Erro de rede: " + String(e));
    }
    setUploading(false);
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
          <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 4, display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ display: "inline-block", padding: "2px 8px", background: "rgba(139,0,0,.15)", border: "1px solid rgba(192,57,43,.35)", borderRadius: 6, color: "#fff", fontWeight: 600, fontSize: 11 }}>
              {formatDateShort(s.data)}
            </span>
            <span>{s.hora_inicio}–{s.hora_fim}</span>
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
          onClick={() => setUploadModal(s)}
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
          }}
        >
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
                  <td>
                    <span style={{ display: "inline-block", padding: "3px 9px", background: "rgba(139,0,0,.15)", border: "1px solid rgba(192,57,43,.35)", borderRadius: 6, color: "#fff", fontWeight: 600, whiteSpace: "nowrap" }}>
                      {formatDateShort(s.data)}
                    </span>
                  </td>
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
                        onClick={() => setUploadModal(s)}
                        style={{
                          fontSize: 9,
                          padding: "4px 10px",
                          background: "rgba(139,0,0,.1)",
                          border: "1px solid rgba(139,0,0,.2)",
                          borderRadius: 4,
                          color: "var(--primary)",
                          cursor: "pointer",
                        }}
                      >
                        Enviar Ficheiro
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
      {uploadModal && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,.7)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
          onClick={() => { setUploadModal(null); setUploadFile(null); setUploadMsg(""); }}
        >
          <div
            style={{ width: "100%", maxWidth: 460, background: "#111", border: "1px solid var(--border)", borderRadius: 16, padding: 28 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text)" }}>Enviar Ficheiro</h3>
              <button onClick={() => { setUploadModal(null); setUploadFile(null); setUploadMsg(""); }} style={{ color: "var(--text3)", fontSize: 20 }}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div style={{ fontSize: 12, color: "var(--text3)", marginBottom: 16 }}>
              Cliente: <strong style={{ color: "var(--text)" }}>{uploadModal.profiles?.nome || "—"}</strong> • {uploadModal.data} • {uploadModal.tipo}
            </div>

            {/* Tipo select */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 10, color: "var(--text3)", letterSpacing: ".1em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Tipo de entrega</label>
              <select
                value={uploadTipo}
                onChange={(e) => setUploadTipo(e.target.value)}
                style={{ width: "100%", padding: "10px 12px", borderRadius: 8, background: "rgba(255,255,255,.04)", border: "1px solid var(--border)", color: "var(--text)", fontSize: 13 }}
              >
                <option value="demo">Demo</option>
                <option value="mix">Mix</option>
                <option value="master">Master</option>
                <option value="projecto_final">Projecto Final</option>
                <option value="stems">Stems</option>
                <option value="foto">Foto</option>
              </select>
            </div>

            {/* File input / drop area */}
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: "2px dashed rgba(139,0,0,.3)",
                borderRadius: 12,
                padding: "28px 16px",
                textAlign: "center",
                cursor: "pointer",
                background: uploadFile ? "rgba(139,0,0,.05)" : "transparent",
                transition: "background .2s",
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".mp3,.wav,.aiff,.flac,.zip,.jpg,.png"
                style={{ display: "none" }}
                onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
              />
              {uploadFile ? (
                <div>
                  <span className="material-symbols-outlined" style={{ fontSize: 28, color: "var(--primary)", display: "block", marginBottom: 8 }}>audio_file</span>
                  <div style={{ fontSize: 13, color: "var(--text)", fontWeight: 500 }}>{uploadFile.name}</div>
                  <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 4 }}>{(uploadFile.size / 1024 / 1024).toFixed(1)} MB</div>
                </div>
              ) : (
                <div>
                  <span className="material-symbols-outlined" style={{ fontSize: 32, color: "var(--text3)", display: "block", marginBottom: 8 }}>cloud_upload</span>
                  <div style={{ fontSize: 12, color: "var(--text3)" }}>Clique para selecionar ficheiro</div>
                  <div style={{ fontSize: 10, color: "var(--text3)", marginTop: 4 }}>.mp3, .wav, .aiff, .flac, .zip, .jpg, .png • Máx 500MB</div>
                </div>
              )}
            </div>

            {/* Warning */}
            <div style={{ marginTop: 12, padding: "10px 14px", background: "rgba(220,38,38,.06)", borderRadius: 8, border: "1px solid rgba(220,38,38,.15)" }}>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,.6)", display: "flex", alignItems: "center", gap: 6 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 14, color: "#f87171" }}>info</span>
                O ficheiro será apagado automaticamente após 14 dias
              </div>
            </div>

            {/* Messages */}
            {uploadMsg && (
              <div style={{ marginTop: 12, fontSize: 12, color: uploadMsg.includes("sucesso") ? "#4ade80" : "#f87171", fontWeight: 500 }}>
                {uploadMsg}
              </div>
            )}

            {/* Submit button */}
            <button
              onClick={handleUpload}
              disabled={!uploadFile || uploading}
              style={{
                marginTop: 16,
                width: "100%",
                padding: "13px 20px",
                borderRadius: 8,
                background: uploadFile ? "linear-gradient(135deg, var(--primary-c), #a00000)" : "rgba(255,255,255,.04)",
                border: "none",
                color: uploadFile ? "#fff" : "var(--text3)",
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: ".1em",
                textTransform: "uppercase",
                cursor: uploadFile ? "pointer" : "not-allowed",
                opacity: uploading ? 0.6 : 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>{uploading ? "hourglass_top" : "cloud_upload"}</span>
              {uploading ? "A enviar..." : "Enviar"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
