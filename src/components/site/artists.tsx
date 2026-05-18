export function ArtistsSection() {
  const artists = [
    { size: "ac-s", src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80" },
    { size: "ac-m ac-offset-down", src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80" },
    { size: "ac-l", src: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&q=80" },
    { size: "ac-xl ac-offset-down", src: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&q=80", style: { marginBottom: -60 } },
    { size: "ac-l", src: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=500&q=80" },
    { size: "ac-m ac-offset-down", src: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80" },
    { size: "ac-s", src: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80" },
  ];

  return (
    <section className="artists-section" id="artists">
      <h2 className="artists-title">ARTISTAS</h2>
      <div className="artists-row">
        {artists.map((a, i) => (
          <div key={i} className={`artist-circle ${a.size}`} style={a.style}>
            <img src={a.src} alt={`Artist ${i + 1}`} />
          </div>
        ))}
      </div>
      <div className="artists-quote">
        <div className="artists-quote-line" />
        <p>&ldquo;Aqueles que trazem arte ao povo com os olhos e ouvidos abertos.&rdquo;</p>
      </div>
    </section>
  );
}
