"use client";

import { useState } from "react";
import { Headphones, Heart, Pause, Repeat, Shuffle, SkipBack, SkipForward, Volume2 } from "lucide-react";

const playlist = [
  { id: "5iZs0AoBw25tkUk5cKWZCt", title: "Revival", artist: "Wavy, Alexandre Campos, Zero, J Lyn", album: "Revival - Eclipse", duration: "3:00", currentTime: "0:00", progress: 0, spotifyUrl: "https://open.spotify.com/track/5iZs0AoBw25tkUk5cKWZCt", embedUrl: "https://open.spotify.com/embed/track/5iZs0AoBw25tkUk5cKWZCt?utm_source=generator" },
  { id: "6OGNBJtT49gobi2wHmURRd", title: "Wad", artist: "Wavy, Sobv JayTee, Alexandre Campos", album: "Revival - Eclipse", duration: "3:00", currentTime: "0:00", progress: 0, spotifyUrl: "https://open.spotify.com/track/6OGNBJtT49gobi2wHmURRd", embedUrl: "https://open.spotify.com/embed/track/6OGNBJtT49gobi2wHmURRd?utm_source=generator" },
  { id: "1rPUOhjVXd90LNc3jsQZqc", title: "Fado", artist: "Wavy, Sobv JayTee, ZINDA, Alexandre Campos, Zero", album: "Revival - Eclipse", duration: "3:00", currentTime: "0:00", progress: 0, spotifyUrl: "https://open.spotify.com/track/1rPUOhjVXd90LNc3jsQZqc", embedUrl: "https://open.spotify.com/embed/track/1rPUOhjVXd90LNc3jsQZqc?utm_source=generator" },
  { id: "510HLDfI4eaqnU7EWMAjbA", title: "Cafetao", artist: "Wavy, Penelas Sidney, Lil Guiness, BabyWalk, Cys B", album: "Revival - Eclipse", duration: "3:00", currentTime: "0:00", progress: 0, spotifyUrl: "https://open.spotify.com/track/510HLDfI4eaqnU7EWMAjbA", embedUrl: "https://open.spotify.com/embed/track/510HLDfI4eaqnU7EWMAjbA?utm_source=generator" },
  { id: "62Bi53yQFS4j8u5RyZPpVN", title: "Bbb", artist: "Wavy, Alexandre Campos, BabyWalk, Paulo D, YoLino", album: "Revival - Eclipse", duration: "3:00", currentTime: "0:00", progress: 0, spotifyUrl: "https://open.spotify.com/track/62Bi53yQFS4j8u5RyZPpVN", embedUrl: "https://open.spotify.com/embed/track/62Bi53yQFS4j8u5RyZPpVN?utm_source=generator" },
  { id: "0s0H9gmydniJp8s8kC0Jbr", title: "Multiplica", artist: "Wavy, Bere, Márcio Ferreira, ZINDA", album: "Revival - Eclipse", duration: "3:00", currentTime: "0:00", progress: 0, spotifyUrl: "https://open.spotify.com/track/0s0H9gmydniJp8s8kC0Jbr", embedUrl: "https://open.spotify.com/embed/track/0s0H9gmydniJp8s8kC0Jbr?utm_source=generator" },
  { id: "1XGw3kezOtxi6odeyfE7bu", title: "Millions", artist: "Wavy, Alexandre Campos, Helcírio, Nya Heerah", album: "Revival - Eclipse", duration: "3:00", currentTime: "0:00", progress: 0, spotifyUrl: "https://open.spotify.com/track/1XGw3kezOtxi6odeyfE7bu", embedUrl: "https://open.spotify.com/embed/track/1XGw3kezOtxi6odeyfE7bu?utm_source=generator" },
  { id: "0VQVQ2CJ6lf91jDWHZFmDM", title: "Sprint", artist: "Wavy, Micha Star, Paulo D, Evas", album: "Revival - Eclipse", duration: "3:00", currentTime: "0:00", progress: 0, spotifyUrl: "https://open.spotify.com/track/0VQVQ2CJ6lf91jDWHZFmDM", embedUrl: "https://open.spotify.com/embed/track/0VQVQ2CJ6lf91jDWHZFmDM?utm_source=generator" },
  { id: "4F6LRdWk4t2dPqsPh6aDHf", title: "So Assim", artist: "Wavy, LipeSky, Puto Mira, Mané Galinha", album: "Revival - Eclipse", duration: "3:00", currentTime: "0:00", progress: 0, spotifyUrl: "https://open.spotify.com/track/4F6LRdWk4t2dPqsPh6aDHf", embedUrl: "https://open.spotify.com/embed/track/4F6LRdWk4t2dPqsPh6aDHf?utm_source=generator" },
  { id: "0IJ6JwMaMja6WyQFaoTnbv", title: "Militantes", artist: "Wavy, Lukeny, E2SON, Lusah", album: "Revival - Eclipse", duration: "3:00", currentTime: "0:00", progress: 0, spotifyUrl: "https://open.spotify.com/track/0IJ6JwMaMja6WyQFaoTnbv", embedUrl: "https://open.spotify.com/embed/track/0IJ6JwMaMja6WyQFaoTnbv?utm_source=generator" },
  { id: "6gH8Zo5cVEcVv0CXb27Hxq", title: "Topo da Town", artist: "Wavy, Bere, YANKEMA", album: "Revival - Eclipse", duration: "3:00", currentTime: "0:00", progress: 0, spotifyUrl: "https://open.spotify.com/track/6gH8Zo5cVEcVv0CXb27Hxq", embedUrl: "https://open.spotify.com/embed/track/6gH8Zo5cVEcVv0CXb27Hxq?utm_source=generator" },
  { id: "2dFafSUdmExOrevcorqZlj", title: "Não Há Maka", artist: "Wavy, Alexandre Campos, LordCk, J Lyn", album: "Revival - Eclipse", duration: "3:00", currentTime: "0:00", progress: 0, spotifyUrl: "https://open.spotify.com/track/2dFafSUdmExOrevcorqZlj", embedUrl: "https://open.spotify.com/embed/track/2dFafSUdmExOrevcorqZlj?utm_source=generator" },
  { id: "2oE9VdNKKkLQUu3Y2fRYEn", title: "Meu Move", artist: "Wavy", album: "Revival - Eclipse", duration: "3:00", currentTime: "0:00", progress: 0, spotifyUrl: "https://open.spotify.com/track/2oE9VdNKKkLQUu3Y2fRYEn", embedUrl: "https://open.spotify.com/embed/track/2oE9VdNKKkLQUu3Y2fRYEn?utm_source=generator" },
  { id: "1Pt4hXiE1LYHeLDseR5UQi", title: "Fundo Do Poço", artist: "Wavy, LordCk, Jess AL", album: "Revival - Eclipse", duration: "3:00", currentTime: "0:00", progress: 0, spotifyUrl: "https://open.spotify.com/track/1Pt4hXiE1LYHeLDseR5UQi", embedUrl: "https://open.spotify.com/embed/track/1Pt4hXiE1LYHeLDseR5UQi?utm_source=generator" },
];

export function ListenSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeTrack = playlist[activeIndex];

  return (
    <section className="listen-section">
      <div className="listen-glow-1" />
      <div className="listen-glow-2" />

      <div className="listen-container">
        <div className="listen-card glass">
          <div className="listen-card-gradient" />

          <div className="listen-grid">
            {/* Left — Info */}
            <div className="listen-info">
              <span className="listen-badge">LISTEN</span>
              <h2 className="listen-title bebas">REVIVAL — ECLIPSE</h2>
              <p className="listen-desc">
                O álbum que define o som Wavy. Stream, descobre e mergulha numa experiência audiovisual imersiva.
              </p>

              <div className="listen-highlight glass">
                <div className="listen-highlight-icon">
                  <Headphones size={16} />
                </div>
                <div>
                  <h3 className="listen-highlight-title">Spatial Audio</h3>
                  <p className="listen-highlight-desc">Paisagens sonoras cinematográficas para cada mood.</p>
                </div>
              </div>

              <a href="https://open.spotify.com/album/4yT2KVYNxBsDWZp0KzNfDE" target="_blank" rel="noopener noreferrer" className="listen-cta">
                Ouvir no Spotify
              </a>
            </div>

            {/* Right — Player + Playlist */}
            <div className="listen-player-col">
              {/* Now Playing */}
              <div className="listen-now-playing glass">
                <div className="listen-np-header">
                  <div>
                    <span className="listen-np-label">NOW PLAYING</span>
                    <h3 className="listen-np-title">{activeTrack.title}</h3>
                    <p className="listen-np-artist">{activeTrack.artist}</p>
                  </div>
                  <button className="listen-icon-btn" aria-label="Like">
                    <Heart size={16} />
                  </button>
                </div>

                {/* Progress */}
                <div className="listen-progress-wrap">
                  <div className="listen-progress-times">
                    <span>{activeTrack.currentTime}</span>
                    <span>{activeTrack.duration}</span>
                  </div>
                  <div className="listen-progress-bar">
                    <div className="listen-progress-fill" style={{ width: `${activeTrack.progress}%` }} />
                  </div>
                </div>

                {/* Controls */}
                <div className="listen-controls">
                  <div className="listen-controls-group">
                    <button className="listen-icon-btn" aria-label="Shuffle"><Shuffle size={16} /></button>
                    <button className="listen-icon-btn" aria-label="Previous" onClick={() => setActiveIndex(i => Math.max(0, i - 1))}><SkipBack size={16} /></button>
                  </div>
                  <button className="listen-play-btn" aria-label="Pause"><Pause size={20} /></button>
                  <div className="listen-controls-group">
                    <button className="listen-icon-btn" aria-label="Next" onClick={() => setActiveIndex(i => Math.min(playlist.length - 1, i + 1))}><SkipForward size={16} /></button>
                    <button className="listen-icon-btn" aria-label="Repeat"><Repeat size={16} /></button>
                    <button className="listen-icon-btn" aria-label="Volume"><Volume2 size={16} /></button>
                  </div>
                </div>

                {/* Spotify Embed */}
                <div className="listen-embed">
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
              <div className="listen-playlist-wrap">
                <div className="listen-playlist">
                  {playlist.map((track, index) => (
                    <button
                      key={track.id}
                      onClick={() => setActiveIndex(index)}
                      className={`listen-track ${index === activeIndex ? "listen-track-active" : ""}`}
                    >
                      <div className="listen-track-avatar">
                        {track.title.charAt(0)}
                      </div>
                      <div className="listen-track-info">
                        <span className="listen-track-name">{track.title}</span>
                        <span className="listen-track-artist">{track.artist}</span>
                      </div>
                      <span className="listen-track-duration">{track.duration}</span>
                    </button>
                  ))}
                </div>
                <div className="listen-playlist-fade-top" />
                <div className="listen-playlist-fade-bottom" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .listen-section {
          position: relative;
          overflow: hidden;
          padding: 80px 24px;
          background: var(--bg);
        }
        .listen-glow-1 {
          position: absolute; top: 0; left: 50%; transform: translateX(-50%);
          width: 520px; height: 520px; border-radius: 50%;
          background: rgba(139,0,0,.04); filter: blur(80px); pointer-events: none;
        }
        .listen-glow-2 {
          position: absolute; bottom: 0; right: 0;
          width: 420px; height: 420px; border-radius: 50%;
          background: rgba(255,180,168,.02); filter: blur(80px); pointer-events: none;
        }
        .listen-container { max-width: 1200px; margin: 0 auto; }
        .listen-card {
          position: relative; padding: 48px; border-radius: 24px;
          background: rgba(255,255,255,.02) !important;
          border: 1px solid rgba(255,255,255,.06) !important;
          backdrop-filter: blur(24px);
        }
        .listen-card-gradient {
          position: absolute; inset: 0; border-radius: 24px;
          background: linear-gradient(135deg, rgba(139,0,0,.04) 0%, transparent 50%);
          pointer-events: none;
        }
        .listen-grid {
          position: relative; z-index: 1;
          display: grid; grid-template-columns: 1.15fr 0.85fr; gap: 48px;
        }
        .listen-info { display: flex; flex-direction: column; gap: 20px; }
        .listen-badge {
          display: inline-block; width: fit-content;
          font-size: 10px; font-weight: 600; letter-spacing: .2em; text-transform: uppercase;
          color: var(--text3); padding: 5px 12px;
          border: 1px solid rgba(255,255,255,.1); border-radius: 100px;
          background: rgba(255,255,255,.03);
        }
        .listen-title {
          font-size: clamp(36px, 5vw, 56px); letter-spacing: .04em;
          line-height: 1; color: var(--text);
        }
        .listen-desc {
          font-size: 15px; color: var(--text2); line-height: 1.7; max-width: 480px;
        }
        .listen-highlight {
          display: flex; align-items: flex-start; gap: 14px;
          padding: 18px !important; border-radius: 18px !important;
        }
        .listen-highlight-icon {
          width: 40px; height: 40px; border-radius: 50%;
          border: 1px solid rgba(255,255,255,.1);
          background: rgba(139,0,0,.12); color: var(--primary);
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .listen-highlight-title { font-size: 15px; font-weight: 600; color: var(--text); margin-bottom: 4px; }
        .listen-highlight-desc { font-size: 13px; color: var(--text3); line-height: 1.5; }
        .listen-cta {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 13px 28px; border-radius: 100px;
          background: var(--primary-c); color: #fff;
          font-size: 12px; font-weight: 600; letter-spacing: .15em; text-transform: uppercase;
          transition: all .3s; width: fit-content;
        }
        .listen-cta:hover { background: #a00000; transform: translateY(-1px); box-shadow: 0 8px 32px rgba(139,0,0,.4); }

        .listen-player-col { display: flex; flex-direction: column; gap: 16px; }
        .listen-now-playing {
          padding: 24px !important; border-radius: 20px !important;
        }
        .listen-np-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }
        .listen-np-label { font-size: 9px; font-weight: 600; letter-spacing: .3em; text-transform: uppercase; color: var(--text3); }
        .listen-np-title { font-size: 22px; font-weight: 700; color: var(--text); margin-top: 6px; }
        .listen-np-artist { font-size: 12px; color: var(--text3); margin-top: 2px; }
        .listen-icon-btn {
          width: 38px; height: 38px; border-radius: 50%;
          border: 1px solid rgba(255,255,255,.08); background: rgba(255,255,255,.03);
          color: var(--text3); display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all .2s;
        }
        .listen-icon-btn:hover { border-color: rgba(255,255,255,.2); color: var(--text); background: rgba(255,255,255,.06); }

        .listen-progress-wrap { padding-top: 20px; }
        .listen-progress-times { display: flex; justify-content: space-between; font-size: 10px; color: var(--text3); margin-bottom: 6px; }
        .listen-progress-bar { height: 4px; background: rgba(255,255,255,.08); border-radius: 2px; overflow: hidden; }
        .listen-progress-fill { height: 100%; background: linear-gradient(90deg, var(--primary-c), var(--primary)); border-radius: 2px; transition: width .3s; }

        .listen-controls { display: flex; align-items: center; justify-content: space-between; padding-top: 20px; }
        .listen-controls-group { display: flex; align-items: center; gap: 6px; }
        .listen-play-btn {
          width: 48px; height: 48px; border-radius: 50%;
          background: var(--text); color: var(--bg);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; border: none; transition: all .2s;
        }
        .listen-play-btn:hover { opacity: .85; transform: scale(1.05); }

        .listen-embed { margin-top: 20px; border-radius: 14px; overflow: hidden; border: 1px solid rgba(255,255,255,.06); }

        .listen-playlist-wrap { position: relative; }
        .listen-playlist {
          max-height: 320px; overflow-y: auto; display: flex; flex-direction: column; gap: 8px;
          padding: 4px 4px 4px 0; scrollbar-width: thin; scrollbar-color: rgba(255,255,255,.08) transparent;
        }
        .listen-playlist::-webkit-scrollbar { width: 3px; }
        .listen-playlist::-webkit-scrollbar-thumb { background: rgba(255,255,255,.08); border-radius: 3px; }
        .listen-playlist-fade-top { position: absolute; top: 0; left: 0; right: 0; height: 24px; background: linear-gradient(to bottom, var(--bg), transparent); pointer-events: none; }
        .listen-playlist-fade-bottom { position: absolute; bottom: 0; left: 0; right: 0; height: 24px; background: linear-gradient(to top, var(--bg), transparent); pointer-events: none; }

        .listen-track {
          display: flex; align-items: center; gap: 12px; width: 100%;
          padding: 12px 14px; border-radius: 14px; border: 1px solid rgba(255,255,255,.05);
          background: rgba(255,255,255,.02); cursor: pointer; transition: all .25s;
          text-align: left;
        }
        .listen-track:hover { border-color: rgba(255,255,255,.1); transform: translateY(-1px); }
        .listen-track-active {
          border-color: rgba(139,0,0,.3) !important;
          background: rgba(139,0,0,.06) !important;
          box-shadow: 0 8px 32px rgba(139,0,0,.1);
        }
        .listen-track-avatar {
          width: 36px; height: 36px; border-radius: 50%; flex-shrink: 0;
          background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.08);
          display: flex; align-items: center; justify-content: center;
          font-size: 12px; font-weight: 600; color: var(--text3);
        }
        .listen-track-active .listen-track-avatar { background: rgba(139,0,0,.15); color: var(--primary); }
        .listen-track-info { flex: 1; min-width: 0; }
        .listen-track-name { display: block; font-size: 13px; font-weight: 600; color: var(--text2); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .listen-track-artist { display: block; font-size: 11px; color: var(--text3); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .listen-track-duration { font-size: 10px; font-weight: 500; color: var(--text3); letter-spacing: .1em; flex-shrink: 0; }

        /* ── Mobile ── */
        @media (max-width: 1024px) {
          .listen-grid { grid-template-columns: 1fr; gap: 32px; }
          .listen-card { padding: 28px; }
        }
        @media (max-width: 768px) {
          .listen-section { padding: 48px 16px; }
          .listen-card { padding: 20px; border-radius: 18px; }
          .listen-title { font-size: 32px; }
          .listen-now-playing { padding: 18px !important; }
          .listen-controls-group { gap: 4px; }
          .listen-icon-btn { width: 34px; height: 34px; }
          .listen-play-btn { width: 42px; height: 42px; }
          .listen-playlist { max-height: 240px; }
        }
        @media (max-width: 480px) {
          .listen-card { padding: 16px; }
          .listen-np-title { font-size: 18px; }
          .listen-desc { font-size: 13px; }
        }
      `}} />
    </section>
  );
}
