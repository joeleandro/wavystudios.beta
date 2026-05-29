"use client";

import { useState, useRef } from "react";

interface UploadModalProps {
  sessaoId: string;
  clienteId: string;
  clienteNome: string;
  onClose: () => void;
  onSuccess: () => void;
}

const TIPOS = [
  { value: "demo", label: "Demo" },
  { value: "mix", label: "Mix" },
  { value: "master", label: "Master" },
  { value: "projecto_final", label: "Projecto Final" },
  { value: "stems", label: "Stems" },
  { value: "foto", label: "Foto/Vídeo" },
];

export function UploadModal({ sessaoId, clienteId, clienteNome, onClose, onSuccess }: UploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [tipo, setTipo] = useState("projecto_final");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) setFile(f);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) setFile(f);
  }

  async function handleUpload() {
    if (!file) { setError("Selecciona um ficheiro"); return; }
    setUploading(true);
    setError("");
    setProgress(10);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("sessao_id", sessaoId);
    formData.append("cliente_id", clienteId);
    formData.append("tipo", tipo);

    try {
      setProgress(30);
      const res = await fetch("/api/entregas", {
        method: "POST",
        body: formData,
      });
      setProgress(80);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erro no upload");
        setUploading(false);
        setProgress(0);
        return;
      }

      setProgress(100);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 800);
    } catch {
      setError("Erro de rede");
      setUploading(false);
      setProgress(0);
    }
  }

  const fileSize = file ? (file.size / 1024 / 1024).toFixed(1) + " MB" : "";

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(0,0,0,.7)", backdropFilter: "blur(8px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 20, animation: "fade-in .2s ease",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--bg2)", border: "1px solid var(--border2)",
          borderRadius: 16, padding: "32px 28px", width: "100%", maxWidth: 480,
          animation: "wavy-scale-in .3s cubic-bezier(.4,0,.2,1)",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 600, color: "var(--text)" }}>Enviar Ficheiro</div>
            <div style={{ fontSize: 12, color: "var(--text3)", marginTop: 2 }}>Para: {clienteNome}</div>
          </div>
          <button onClick={onClose} style={{ color: "var(--text3)", cursor: "pointer" }}>
            <span className="material-symbols-outlined" style={{ fontSize: 22 }}>close</span>
          </button>
        </div>

        {/* Tipo selector */}
        <div style={{ marginBottom: 18 }}>
          <label style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".15em", textTransform: "uppercase", color: "var(--text3)", display: "block", marginBottom: 8 }}>
            Tipo de entrega
          </label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6 }}>
            {TIPOS.map((t) => (
              <button
                key={t.value}
                onClick={() => setTipo(t.value)}
                style={{
                  padding: "8px 6px", borderRadius: 8, fontSize: 10, fontWeight: 600,
                  letterSpacing: ".06em", textTransform: "uppercase", cursor: "pointer",
                  background: tipo === t.value ? "rgba(139,0,0,.12)" : "rgba(255,255,255,.02)",
                  border: tipo === t.value ? "1px solid rgba(139,0,0,.4)" : "1px solid var(--border)",
                  color: tipo === t.value ? "var(--primary)" : "var(--text3)",
                  transition: "all .2s",
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Drop zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          style={{
            border: `2px dashed ${dragOver ? "var(--primary-c)" : "var(--border)"}`,
            borderRadius: 12, padding: "36px 20px", textAlign: "center",
            cursor: "pointer", transition: "all .2s",
            background: dragOver ? "rgba(139,0,0,.04)" : "transparent",
          }}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".mp3,.wav,.aiff,.flac,.zip,.jpg,.png"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
          {file ? (
            <div>
              <span className="material-symbols-outlined" style={{ fontSize: 32, color: "var(--primary)", display: "block", marginBottom: 8 }}>audio_file</span>
              <div style={{ fontSize: 14, fontWeight: 500, color: "var(--text)" }}>{file.name}</div>
              <div style={{ fontSize: 12, color: "var(--text3)", marginTop: 4 }}>{fileSize}</div>
            </div>
          ) : (
            <div>
              <span className="material-symbols-outlined" style={{ fontSize: 36, color: "var(--text3)", display: "block", marginBottom: 8 }}>cloud_upload</span>
              <div style={{ fontSize: 13, color: "var(--text2)" }}>Arrasta um ficheiro ou clica para seleccionar</div>
              <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 6 }}>.mp3 .wav .aiff .flac .zip .jpg .png • Máx. 500MB</div>
            </div>
          )}
        </div>

        {/* Progress bar */}
        {uploading && (
          <div style={{ marginTop: 16 }}>
            <div style={{ height: 4, background: "rgba(255,255,255,.06)", borderRadius: 4, overflow: "hidden" }}>
              <div style={{
                height: "100%", width: `${progress}%`,
                background: progress === 100 ? "#4ade80" : "linear-gradient(90deg, var(--primary-c), var(--primary))",
                borderRadius: 4, transition: "width .4s ease",
              }} />
            </div>
            <div style={{ fontSize: 11, color: "var(--text3)", textAlign: "center", marginTop: 6 }}>
              {progress < 100 ? "A enviar..." : "✓ Enviado!"}
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{ marginTop: 12, fontSize: 12, color: "#f87171", padding: "8px 12px", background: "rgba(239,68,68,.06)", border: "1px solid rgba(239,68,68,.15)", borderRadius: 8 }}>
            {error}
          </div>
        )}

        {/* Warning */}
        <div style={{ marginTop: 16, fontSize: 11, color: "var(--text3)", display: "flex", alignItems: "center", gap: 6 }}>
          <span className="material-symbols-outlined" style={{ fontSize: 14, color: "#facc15" }}>warning</span>
          O ficheiro será apagado automaticamente após 14 dias
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
          <button onClick={onClose} style={{
            flex: 1, padding: "12px", borderRadius: 8, fontSize: 11, fontWeight: 600,
            letterSpacing: ".15em", textTransform: "uppercase", cursor: "pointer",
            border: "1px solid var(--border)", color: "var(--text3)", background: "transparent",
          }}>
            Cancelar
          </button>
          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            style={{
              flex: 1, padding: "12px", borderRadius: 8, fontSize: 11, fontWeight: 600,
              letterSpacing: ".15em", textTransform: "uppercase", cursor: "pointer",
              border: "none", color: "#fff",
              background: !file || uploading ? "rgba(139,0,0,.3)" : "linear-gradient(135deg, var(--primary-c), #a00000)",
              opacity: !file || uploading ? 0.5 : 1,
              boxShadow: file && !uploading ? "0 4px 16px rgba(139,0,0,.3)" : "none",
            }}
          >
            {uploading ? "A enviar..." : "Enviar"}
          </button>
        </div>
      </div>
    </div>
  );
}
