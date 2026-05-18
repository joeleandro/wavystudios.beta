const members = [
  { name: "Olinaz Fushi", role: "Project Manager", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=80" },
  { name: "David Elone", role: "Designer Head", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&q=80" },
  { name: "Jacob Jones", role: "Web Developer", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80" },
  { name: "Melina Opole", role: "Lead Designer", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&q=80" },
];

export function TeamSection() {
  return (
    <section className="team-section" id="team">
      {members.map((m) => (
        <div key={m.name} className="team-member">
          <img className="team-member-img" src={m.img} alt={m.name} />
          <div className="team-overlay" />
          <div className="team-info">
            <div className="team-accent" />
            <div className="team-name bebas">{m.name}</div>
            <div className="team-role">{m.role}</div>
          </div>
        </div>
      ))}
    </section>
  );
}
