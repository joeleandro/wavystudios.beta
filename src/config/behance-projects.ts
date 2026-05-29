/**
 * WAVY STUDIOS — Behance Projects Config
 * ----------------------------------------
 * Edita os links aqui para actualizar a galeria na home page.
 * Cada item tem:
 *   - url:   link directo do projecto no Behance
 *   - title: nome do projecto (aparece no hover)
 *   - desc:  breve descrição (aparece no hover)
 *   - span:  tamanho na grelha (usa classes Tailwind)
 *             "":              1 coluna (padrão)
 *             "md:col-span-2": 2 colunas
 */

export type BehanceProject = {
  id: number;
  url: string;
  title: string;
  desc: string;
  span: string;
};

export const behanceProjects: BehanceProject[] = [
  {
    id: 1,
    url: "https://www.behance.net/gallery/216067819/The-Wavy-Experience",
    title: "The Wavy Experience",
    desc: "Captação & Produção",
    span: "md:col-span-2",
  },
  {
    id: 2,
    url: "https://www.behance.net/gallery/216067819/The-Wavy-Experience",
    title: "Mix & Master",
    desc: "Finalização de som",
    span: "",
  },
  {
    id: 3,
    url: "https://www.behance.net/gallery/216067819/The-Wavy-Experience",
    title: "Sessão Vocal",
    desc: "Captação em estúdio",
    span: "",
  },
  {
    id: 4,
    url: "https://www.behance.net/gallery/216067819/The-Wavy-Experience",
    title: "Produção Musical",
    desc: "Do zero ao beat",
    span: "",
  },
  {
    id: 5,
    url: "https://www.behance.net/gallery/216067819/The-Wavy-Experience",
    title: "Direcção Criativa",
    desc: "Identidade sonora",
    span: "md:col-span-2",
  },
  {
    id: 6,
    url: "https://www.behance.net/gallery/216067819/The-Wavy-Experience",
    title: "Fotografia",
    desc: "Conteúdo visual",
    span: "",
  },
  {
    id: 7,
    url: "https://www.behance.net/gallery/216067819/The-Wavy-Experience",
    title: "Videoclipe",
    desc: "Direcção artística",
    span: "",
  },
  {
    id: 8,
    url: "https://www.behance.net/gallery/216067819/The-Wavy-Experience",
    title: "Release Campaign",
    desc: "Lançamento musical",
    span: "",
  },
  {
    id: 9,
    url: "https://www.behance.net/gallery/216067819/The-Wavy-Experience",
    title: "Brand Identity",
    desc: "Marca de artista",
    span: "md:col-span-2",
  },
  {
    id: 10,
    url: "https://www.behance.net/gallery/216067819/The-Wavy-Experience",
    title: "Live Sessions",
    desc: "Gravações ao vivo",
    span: "",
  },
];
