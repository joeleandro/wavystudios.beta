/**
 * WAVY STUDIOS — Projects Config
 * ----------------------------------------
 * Each item:
 *   - url:    Behance project link
 *   - title:  project name (shown on hover)
 *   - desc:   short description (shown on hover)
 *   - span:   card size class
 *             "card-wide":  wide (2 units)
 *             "card-tall":  tall (portrait)
 *             "card-large": large square
 *             "":           standard square
 */

export type BehanceProject = {
  id: number;
  url: string;
  title: string;
  desc: string;
  span: string; // "card-wide" | "card-tall" | "card-large" | ""
};

const BASE_URL = "https://www.behance.net/gallery/216067819/The-Wavy-Experience";

export const behanceProjects: BehanceProject[] = [
  { id: 1,  url: BASE_URL, title: "The Wavy Experience",  desc: "Captação & Produção",   span: "card-wide"  },
  { id: 2,  url: BASE_URL, title: "Mix & Master",         desc: "Finalização de som",    span: "card-tall"  },
  { id: 3,  url: BASE_URL, title: "Sessão Vocal",         desc: "Captação em estúdio",   span: ""           },
  { id: 4,  url: BASE_URL, title: "Produção Musical",     desc: "Do zero ao beat",       span: "card-large" },
  { id: 5,  url: BASE_URL, title: "Direcção Criativa",    desc: "Identidade sonora",     span: "card-wide"  },
  { id: 6,  url: BASE_URL, title: "Fotografia",           desc: "Conteúdo visual",       span: ""           },
  { id: 7,  url: BASE_URL, title: "Videoclipe",           desc: "Direcção artística",    span: "card-tall"  },
  { id: 8,  url: BASE_URL, title: "Release Campaign",     desc: "Lançamento musical",    span: ""           },
  { id: 9,  url: BASE_URL, title: "Brand Identity",       desc: "Marca de artista",      span: "card-large" },
  { id: 10, url: BASE_URL, title: "Live Sessions",        desc: "Gravações ao vivo",     span: "card-wide"  },
  { id: 11, url: BASE_URL, title: "Trap Session",         desc: "Rap & Trap",            span: ""           },
  { id: 12, url: BASE_URL, title: "Afrobeat Vibes",       desc: "Afrobeat & Amapiano",   span: "card-tall"  },
  { id: 13, url: BASE_URL, title: "Zouk Nights",          desc: "Zouk & R&B",            span: ""           },
  { id: 14, url: BASE_URL, title: "Sound Design",         desc: "Design sonoro",         span: "card-large" },
  { id: 15, url: BASE_URL, title: "Artist Branding",      desc: "Identidade de artista", span: ""           },
  { id: 16, url: BASE_URL, title: "Studio Moments",       desc: "Behind the scenes",     span: "card-wide"  },
  { id: 17, url: BASE_URL, title: "Wavy Collective",      desc: "Colectivo criativo",    span: ""           },
];
