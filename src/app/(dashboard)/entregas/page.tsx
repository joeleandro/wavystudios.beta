"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Entrega = {
  id: string;
  sessao_id: string;
  nome_ficheiro: string;
  tipo: string;
  tamanho_bytes: number;
  expires_at: string;
  download_count: number;
  criado_em: string;
  sessoes?: { data: string; tipo: string };
};

function getIcon(tipo: string) {
  switch (tipo) {
    case "foto": return "image";
    case "stems": return "folder_zip";
    default: return "audio_file";
  }
}

function getTimeLeft(expiresAt: string): { days: number; hours: number; expired: boolean; label: string } {
  const now = new Date();
  const exp = new Date(expiresAt);
  const diff = exp.getTime() - now.getTime();
  if (diff <= 0) return { days: 0, hours: 0, expired: true, label: "Expirado" };
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  if (days > 0) return { days, hours, expired: false, label: `${days}d ${hours}h restantes` };
  return { days: 0, hours, expired: false, label: `${hours}h restantes` };
}

export default function EntregasPage() {
  const [entregas, setEntregas] = useState<Entrega[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    loadEntregas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  async function loadEntregas() {
    setLoading(true);
    try {
      const res = await fetch("/api/entregas");
      if (res.ok) {
        const data = await res.json();
        setEntregas(data.entregas || []);
      }
    } catch {}
    setLoading(false);
  }

  async function handleDownload(entregaId: string) {
    setDownloading(entregaId);
    try {
      const res = await fetch(`/api/entregas/download?id=${entregaId}`);
      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Erro ao gerar download");
        setDownloading(null);
        return;
      }

      // Open the signed URL in a new tab
      window.open(data.url, "_blank");

      // Update local state
      setEntregas(prev => prev.map(e =>
        e.id === entregaId ? { ...e, download_count: data.download_count } : e
      ));
    } catch {
      alert("Erro de rede");
    }
    setDownloading(null);
  }

  const active = entregas.filter(e => !getTimeLeft(e.expires_at).expired);
  const expired = entregas.filter(e => getTimeLeft(e.expires_at).expired);

  if (loading) {
    return (
      <div style={{ maxWidth: "100%" }}>
        <div style={{ marginBottom: 26 }}>
          <div className="db-page-title bebas">Entregas</div>
          <div className="db-page-sub">A carregar...</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[0, 1, 2].map(i => <div key={i} className="skeleton" style={{ height: 80, borderRadius: 12 }} />)}
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "100%" }}>
      <div style={{ marginBottom: 26 }}>
        <div className="db-page-title bebas">Entregas</div>
        <div className="db-page-sub">{entregas.length} ficheiro{entregas.length !== 1 ? "s" : ""} • Downloads disponíveis por 14 dias</div>
      </div>

      {entregas.length === 0 ? (
        <div className="db-card" style={{ textAlign: "center", padding: "48px 32px" }}>
          <span className="material-symbols-outlined" style={{ fontSize: 48, color: "var(--text3)", opacity: 0.4, display: "block", marginBottom: 12 }}>cloud_download</span>
          <div style={{ fontSize: 15, color: "var(--text2)", marginBottom: 6 }}>Sem entregas</div>
          <div style={{ fontSize: 12, color: "var(--text3)" }}>Quando o admin enviar um ficheiro, aparecerá aqui.</div>
        </div>
      ) : (
        <>
          {/* Active deliveries */}
          {active.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".15em", textTransform: "uppercase", color: "var(--text3)", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 14, color: "#4ade80" }}>check_circle</span>
                Disponíveis ({active.length})
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {active.map(e => {
                  const time = getTimeLeft(e.expires_at);
                  const urgent = time.days <= 3;
                  return (
                    <div key={e.id} className="db-card" style={{ padding: "16px 18px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                        {/* Icon */}
                        <div style={{
                          width: 44, height: 44, borderRadius: 10, flexShrink: 0,
                          background: "rgba(139,0,0,.1)", border: "1px solid rgba(139,0,0,.2)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                          <span className="material-symbols-outlined" style={{ fontSize: 22, color: "var(--primary)" }}>{getIcon(e.tipo)}</span>
                        </div>

                        {/* Info */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 14, fontWeight: 500, color: "var(--text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {e.nome_ficheiro}
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 4, flexWrap: "wrap" }}>
                            <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--text3)", background: "rgba(255,255,255,.04)", padding: "2px 8px", borderRadius: 4 }}>
                              {e.tipo.replace("_", " ")}
                            </span>
                            <span style={{ fontSize: 11, color: "var(--text3)" }}>
                              {(e.tamanho_bytes / 1024 / 1024).toFixed(1)} MB
                            </span>
                            {e.download_count > 0 && (
                              <span style={{ fontSize: 11, color: "var(--text3)", display: "flex", alignItems: "center", gap: 3 }}>
                                <span className="material-symbols-outlined" style={{ fontSize: 12 }}>download</span>
                                {e.download_count}×
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Countdown + Download */}
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, flexShrink: 0 }}>
                          <div style={{
                            fontSize: 10, fontWeight: 600, letterSpacing: ".06em",
                            color: urgent ? "#f87171" : "var(--text3)",
                            display: "flex", alignItems: "center", gap: 4,
                          }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 12 }}>
                              {urgent ? "warning" : "schedule"}
                            </span>
                            {time.label}
                          </div>
                          <button
                            onClick={() => handleDownload(e.id)}
                            disabled={downloading === e.id}
                            style={{
                              padding: "7px 14px", borderRadius: 6, fontSize: 10, fontWeight: 600,
                              letterSpacing: ".12em", textTransform: "uppercase", cursor: "pointer",
                              background: "linear-gradient(135deg, var(--primary-c), #a00000)",
                              border: "none", color: "#fff",
                              opacity: downloading === e.id ? 0.6 : 1,
                              boxShadow: "0 2px 10px rgba(139,0,0,.2)",
                              display: "flex", alignItems: "center", gap: 4,
                            }}
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>download</span>
                            {downloading === e.id ? "..." : "Download"}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Expired deliveries */}
          {expired.length > 0 && (
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".15em", textTransform: "uppercase", color: "var(--text3)", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 14, opacity: 0.4 }}>history</span>
                Expirados ({expired.length})
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {expired.map(e => (
                  <div key={e.id} className="db-card" style={{ padding: "14px 18px", opacity: 0.5 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 20, color: "var(--text3)" }}>{getIcon(e.tipo)}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, color: "var(--text3)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {e.nome_ficheiro}
                        </div>
                        <div style={{ fontSize: 10, color: "var(--text3)", marginTop: 2 }}>
                          {e.tipo.replace("_", " ")} • {e.download_count} download{e.download_count !== 1 ? "s" : ""}
                        </div>
                      </div>
                      <span style={{ fontSize: 10, color: "var(--text3)", fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase" }}>
                        Expirado
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
