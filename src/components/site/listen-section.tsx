"use client";

import { useState } from "react";
import { Heart, Pause, Repeat, Shuffle, SkipBack, SkipForward, Volume2 } from "lucide-react";

const playlist = [
  { id: "5iZs0AoBw25tkUk5cKWZCt", title: "Revival", artist: "Wavy, Alexandre Campos, Zero, J Lyn", duration: "3:00", embedUrl: "https://open.spotify.com/embed/track/5iZs0AoBw25tkUk5cKWZCt?utm_source=generator" },
  { id: "6OGNBJtT49gobi2wHmURRd", title: "Wad", artist: "Wavy, Sobv JayTee, Alexandre Campos", duration: "3:00", embedUrl: "https://open.spotify.com/embed/track/6OGNBJtT49gobi2wHmURRd?utm_source=generator" },
  { id: "1rPUOhjVXd90LNc3jsQZqc", title: "Fado", artist: "Wavy, Sobv JayTee, ZINDA, Alexandre Campos, Zero", duration: "3:00", embedUrl: "https://open.spotify.com/embed/track/1rPUOhjVXd90LNc3jsQZqc?utm_source=generator" },
  { id: "510HLDfI4eaqnU7EWMAjbA", title: "Cafetao", artist: "Wavy, Penelas Sidney, Lil Guiness, BabyWalk, Cys B", duration: "3:00", embedUrl: "https://open.spotify.com/embed/track/510HLDfI4eaqnU7EWMAjbA?utm_source=generator" },
  { id: "62Bi53yQFS4j8u5RyZPpVN", title: "Bbb", artist: "Wavy, Alexandre Campos, BabyWalk, Paulo D, YoLino", duration: "3:00", embedUrl: "https://open.spotify.com/embed/track/62Bi53yQFS4j8u5RyZPpVN?utm_source=generator" },
  { id: "0s0H9gmydniJp8s8kC0Jbr", title: "Multiplica", artist: "Wavy, Bere, Márcio Ferreira, ZINDA", duration: "3:00", embedUrl: "https://open.spotify.com/embed/track/0s0H9gmydniJp8s8kC0Jbr?utm_source=generator" },
  { id: "1XGw3kezOtxi6odeyfE7bu", title: "Millions", artist: "Wavy, Alexandre Campos, Helcírio, Nya Heerah", duration: "3:00", embedUrl: "https://open.spotify.com/embed/track/1XGw3kezOtxi6odeyfE7bu?utm_source=generator" },
  { id: "0VQVQ2CJ6lf91jDWHZFmDM", title: "Sprint", artist: "Wavy, Micha Star, Paulo D, Evas", duration: "3:00", embedUrl: "https://open.spotify.com/embed/track/0VQVQ2CJ6lf91jDWHZFmDM?utm_source=generator" },
  { id: "4F6LRdWk4t2dPqsPh6aDHf", title: "So Assim", artist: "Wavy, LipeSky, Puto Mira, Mané Galinha", duration: "3:00", embedUrl: "https://open.spotify.com/embed/track/4F6LRdWk4t2dPqsPh6aDHf?utm_source=generator" },
  { id: "0IJ6JwMaMja6WyQFaoTnbv", title: "Militantes", artist: "Wavy, Lukeny, E2SON, Lusah", duration: "3:00", embedUrl: "https://open.spotify.com/embed/track/0IJ6JwMaMja6WyQFaoTnbv?utm_source=generator" },
  { id: "6gH8Zo5cVEcVv0CXb27Hxq", title: "Topo da Town", artist: "Wavy, Bere, YANKEMA", duration: "3:00", embedUrl: "https://open.spotify.com/embed/track/6gH8Zo5cVEcVv0CXb27Hxq?utm_source=generator" },
  { id: "2dFafSUdmExOrevcorqZlj", title: "Não Há Maka", artist: "Wavy, Alexandre Campos, LordCk, J Lyn", duration: "3:00", embedUrl: "https://open.spotify.com/embed/track/2dFafSUdmExOrevcorqZlj?utm_source=generator" },
  { id: "2oE9VdNKKkLQUu3Y2fRYEn", title: "Meu Move", artist: "Wavy", duration: "3:00", embedUrl: "https://open.spotify.com/embed/track/2oE9VdNKKkLQUu3Y2fRYEn?utm_source=generator" },
  { id: "1Pt4hXiE1LYHeLDseR5UQi", title: "Fundo Do Poço", artist: "Wavy, LordCk, Jess AL", duration: "3:00", embedUrl: "https://open.spotify.com/embed/track/1Pt4hXiE1LYHeLDseR5UQi?utm_source=generator" },
];

export function ListenSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeTrack = playlist[activeIndex];

  return (
    <section className="ls">
      <div className="ls-container">
        {/* Header */}
        <div className="ls-header">
          <span className="ls-badge">LISTEN</span>
          <h2 className="ls-title bebas">REVIVAL — ECLIPSE</h2>
          <p className="ls-desc">
            O álbum que define o som Wavy. Stream, descobre e mergulha numa experiência audiovisual imersiva.
          </p>
          <a href="https://open.spotify.com/album/4yT2KVYNxBsDWZp0KzNfDE" target="_blank" rel="noopener noreferrer" className="ls-cta">
            Ouvir no Spotify
          </a>
        </div>

        {/* Player card */}
        <div className="ls-player">
          {/* Now playing info */}
          <div className="ls-np">
            <div className="ls-np-top">
              <div>
                <span className="ls-np-label">NOW PLAYING</span>
                <h3 className="ls-np-title">{activeTrack.title}</h3>
                <p className="ls-np-artist">{activeTrack.artist}</p>
              </div>
              <button className="ls-icon-btn" aria-label="Like"><Heart size={16} /></button>
            </div>

            {/* Controls */}
            <div className="ls-controls">
              <button className="ls-icon-btn" aria-label="Shuffle"><Shuffle size={14} /></button>
              <button className="ls-icon-btn" aria-label="Previous" onClick={() => setActiveIndex(i => Math.max(0, i - 1))}><SkipBack size={14} /></button>
              <button className="ls-play-btn" aria-label="Pause"><Pause size={18} /></button>
              <button className="ls-icon-btn" aria-label="Next" onClick={() => setActiveIndex(i => Math.min(playlist.length - 1, i + 1))}><SkipForward size={14} /></button>
              <button className="ls-icon-btn" aria-label="Repeat"><Repeat size={14} /></button>
              <button className="ls-icon-btn ls-hide-mobile" aria-label="Volume"><Volume2 size={14} /></button>
            </div>

            {/* Spotify Embed */}
            <div className="ls-embed">
              <iframe
                src={activeTrack.embedUrl}
                title={`${activeTrack.title} - Spotify`}
                width="100%"
                height="152"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                style={{ borderRadius: 12 }}
              />
            </div>
          </div>

          {/* Playlist */}
          <div className="ls-playlist-wrap">
            <div className="ls-playlist">
              {playlist.map((track, index) => (
                <button
                  key={track.id}
                  onClick={() => setActiveIndex(index)}
                  className={`ls-track ${index === activeIndex ? "ls-track-active" : ""}`}
                >
                  <div className="ls-track-num">{String(index + 1).padStart(2, "0")}</div>
                  <div className="ls-track-info">
                    <span className="ls-track-name">{track.title}</span>
                    <span className="ls-track-artist">{track.artist}</span>
                  </div>
                  <span className="ls-track-dur">{track.duration}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .ls {
          position: relative;
          padding: 80px 24px;
          background: var(--bg);
          overflow: hidden;
        }
        .ls-container {
          max-width: 900px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        /* Header */
        .ls-header {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .ls-badge {
          display: inline-block; width: fit-content;
          font-size: 10px; font-weight: 600; letter-spacing: .2em;
          color: var(--text3); padding: 5px 12px;
          border: 1px solid rgba(255,255,255,.1); border-radius: 100px;
          background: rgba(255,255,255,.03);
        }
        .ls-title {
          font-size: clamp(32px, 6vw, 52px);
          letter-spacing: .04em; line-height: 1; color: var(--text);
        }
        .ls-desc {
          font-size: 14px; color: var(--text2); line-height: 1.7;
          max-width: 500px;
        }
        .ls-cta {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 12px 24px; border-radius: 100px;
          background: var(--primary-c); color: #fff;
          font-size: 11px; font-weight: 600; letter-spacing: .15em;
          text-transform: uppercase; width: fit-content;
          transition: all .3s;
        }
        .ls-cta:hover { background: #a00000; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(139,0,0,.35); }

        /* Player */
        .ls-player {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          background: rgba(255,255,255,.02);
          border: 1px solid rgba(255,255,255,.06);
          border-radius: 20px;
          padding: 24px;
          backdrop-filter: blur(16px);
        }

        /* Now playing */
        .ls-np {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .ls-np-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 10px;
        }
        .ls-np-label { font-size: 9px; font-weight: 600; letter-spacing: .3em; color: var(--text3); }
        .ls-np-title { font-size: 20px; font-weight: 700; color: var(--text); margin-top: 6px; }
        .ls-np-artist { font-size: 12px; color: var(--text3); margin-top: 2px; }

        .ls-controls {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }
        .ls-icon-btn {
          width: 34px; height: 34px; border-radius: 50%;
          border: 1px solid rgba(255,255,255,.08);
          background: rgba(255,255,255,.03); color: var(--text3);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all .2s; flex-shrink: 0;
        }
        .ls-icon-btn:hover { border-color: rgba(255,255,255,.2); color: var(--text); }
        .ls-play-btn {
          width: 42px; height: 42px; border-radius: 50%;
          background: var(--text); color: var(--bg);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; border: none; transition: all .2s; flex-shrink: 0;
        }
        .ls-play-btn:hover { opacity: .85; transform: scale(1.05); }

        .ls-embed {
          border-radius: 12px; overflow: hidden;
          border: 1px solid rgba(255,255,255,.06);
        }

        /* Playlist */
        .ls-playlist-wrap {
          position: relative;
          min-height: 0;
        }
        .ls-playlist {
          max-height: 420px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 4px;
          scrollbar-width: thin;
          scrollbar-color: rgba(255,255,255,.08) transparent;
        }
        .ls-playlist::-webkit-scrollbar { width: 3px; }
        .ls-playlist::-webkit-scrollbar-thumb { background: rgba(255,255,255,.08); border-radius: 3px; }

        .ls-track {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          padding: 10px 12px;
          border-radius: 10px;
          border: 1px solid transparent;
          background: transparent;
          cursor: pointer;
          transition: all .2s;
          text-align: left;
        }
        .ls-track:hover { background: rgba(255,255,255,.03); border-color: rgba(255,255,255,.06); }
        .ls-track-active {
          background: rgba(139,0,0,.06) !important;
          border-color: rgba(139,0,0,.2) !important;
        }
        .ls-track-num {
          font-size: 11px; font-weight: 600; color: var(--text3);
          width: 20px; text-align: center; flex-shrink: 0;
        }
        .ls-track-active .ls-track-num { color: var(--primary); }
        .ls-track-info { flex: 1; min-width: 0; }
        .ls-track-name {
          display: block; font-size: 13px; font-weight: 500; color: var(--text2);
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .ls-track-active .ls-track-name { color: var(--text); }
        .ls-track-artist {
          display: block; font-size: 11px; color: var(--text3);
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .ls-track-dur { font-size: 10px; color: var(--text3); flex-shrink: 0; }

        /* ── MOBILE ── */
        @media (max-width: 768px) {
          .ls { padding: 48px 16px; }
          .ls-player {
            grid-template-columns: 1fr;
            padding: 16px;
            border-radius: 16px;
            gap: 16px;
          }
          .ls-np-title { font-size: 17px; }
          .ls-np-artist { font-size: 11px; }
          .ls-controls { gap: 6px; }
          .ls-icon-btn { width: 30px; height: 30px; }
          .ls-play-btn { width: 36px; height: 36px; }
          .ls-embed iframe { height: 80px !important; }
          .ls-playlist { max-height: 240px; }
          .ls-track { padding: 8px 10px; gap: 10px; }
          .ls-track-name { font-size: 12px; }
          .ls-track-artist { font-size: 10px; }
          .ls-hide-mobile { display: none; }
          .ls-title { font-size: 28px; }
          .ls-desc { font-size: 13px; }
          .ls-cta { font-size: 10px; padding: 10px 18px; }
        }
        @media (max-width: 480px) {
          .ls { padding: 32px 12px; }
          .ls-player { padding: 12px; }
          .ls-np-title { font-size: 15px; }
          .ls-controls { justify-content: center; }
          .ls-playlist { max-height: 200px; }
          .ls-track-num { display: none; }
        }
      `}} />
    </section>
  );
}
