/**
 * WAVY STUDIOS — Projects Config
 * ----------------------------------------
 * Each item:
 *   - url:    Behance project link
 *   - title:  project name (shown on hover)
 *   - desc:   short description (shown on hover)
 *   - image:  direct image URL for the project thumbnail
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
  image: string;
  span: string; // "card-wide" | "card-tall" | "card-large" | ""
};

export const behanceProjects: BehanceProject[] = [
  {
    id: 1,
    url: "https://www.behance.net/gallery/211184701/THE-PROJECT-MELHORES-DO-JOGO",
    title: "THE PROJECT - MELHORES DO JOGO",
    desc: "Direção Criativa & Produção",
    image: "https://mir-s3-cdn-cf.behance.net/projects/404/60e84d211184701.671e953ddcffc.jpg",
    span: "card-wide",
  },
  {
    id: 2,
    url: "https://www.behance.net/gallery/194936241/YANG7-STREET-LOVE",
    title: "YANG7 - STREET LOVE",
    desc: "Captação & Mix",
    image: "https://mir-s3-cdn-cf.behance.net/projects/404/027e5e194936241.66047c9a2349e.jpg",
    span: "card-tall",
  },
  {
    id: 3,
    url: "https://www.behance.net/gallery/194935947/CRISTINA-SANTOS-SLOW-DOWN",
    title: "CRISTINA SANTOS - SLOW DOWN",
    desc: "Produção Musical",
    image: "https://mir-s3-cdn-cf.behance.net/projects/404/edcc65194935947.66047b898c5a0.jpg",
    span: "",
  },
  {
    id: 4,
    url: "https://www.behance.net/gallery/191555929/AEME-BONDOKI",
    title: "AÉME - BONDOKI",
    desc: "Captação & Produção",
    image: "https://mir-s3-cdn-cf.behance.net/projects/404/99ef9c191555929.65cda258c25c0.jpg",
    span: "card-large",
  },
  {
    id: 5,
    url: "https://www.behance.net/gallery/184430477/YANKEMA-CAMINHADA",
    title: "YANKEMA - CAMINHADA",
    desc: "Direção Criativa",
    image: "https://mir-s3-cdn-cf.behance.net/projects/404/1448d2184430477.Y3JvcCwxMjg0LDEwMDQsMCwxMzk.jpg",
    span: "card-wide",
  },
  {
    id: 6,
    url: "https://www.behance.net/gallery/184133127/E2SON-INTRO",
    title: "E2SON - INTRO",
    desc: "Captação Vocal",
    image: "https://mir-s3-cdn-cf.behance.net/projects/404/f09a98184133127.Y3JvcCwxMDY2LDgzNCwxMDgsMA.jpg",
    span: "",
  },
  {
    id: 7,
    url: "https://www.behance.net/gallery/184132449/QUEEN-MARCY-NAO-VALES-NADA",
    title: "QUEEN MARCY - NÃO VALES NADA",
    desc: "Mix & Master",
    image: "https://mir-s3-cdn-cf.behance.net/projects/404/268129184132449.Y3JvcCwxMjg0LDEwMDQsMCwyODY.jpg",
    span: "card-tall",
  },
  {
    id: 8,
    url: "https://www.behance.net/gallery/184132239/LORD-CK-TENHO-MEDO",
    title: "LORD CK - TENHO MEDO",
    desc: "Captação & Produção",
    image: "https://mir-s3-cdn-cf.behance.net/projects/404/991ca6184132239.Y3JvcCwxMjg0LDEwMDQsMCwxMjA.jpg",
    span: "",
  },
  {
    id: 9,
    url: "https://www.behance.net/gallery/175719399/Wavy-Album-Liability",
    title: "Wavy - Album Liability",
    desc: "Produção & Direção",
    image: "https://mir-s3-cdn-cf.behance.net/projects/404/6b7484175719399.Y3JvcCwxMjg0LDEwMDQsMCwyNzY.jpg",
    span: "card-large",
  },
  {
    id: 10,
    url: "https://www.behance.net/gallery/175719003/Queen-Marcy-Lover",
    title: "Queen Marcy - Lover",
    desc: "Captação & Mix",
    image: "https://mir-s3-cdn-cf.behance.net/projects/404/a99e11175719003.Y3JvcCwxMjg0LDEwMDQsMCww.jpg",
    span: "card-wide",
  },
  {
    id: 11,
    url: "https://www.behance.net/gallery/172237413/HellyHoay-OAY",
    title: "HellyHoay - OAY",
    desc: "Produção Musical",
    image: "https://mir-s3-cdn-cf.behance.net/projects/404/b812ed172237413.Y3JvcCwxMjg0LDEwMDQsMCwxMDQ.jpg",
    span: "",
  },
  {
    id: 12,
    url: "https://www.behance.net/gallery/166817275/Prodigio-Sorrir-de-Novo-Ft-Sara-Tavares",
    title: "Prodígio - Sorrir de Novo Ft Sara Tavares",
    desc: "Captação & Master",
    image: "https://mir-s3-cdn-cf.behance.net/projects/404/8a9bc4166817275.Y3JvcCwxMTM1LDg4OCw3MywzMDY.jpg",
    span: "card-tall",
  },
  {
    id: 13,
    url: "https://www.behance.net/gallery/166817063/Versos-Poesias-Lusofono",
    title: "Versos & Poesias - Lusófono",
    desc: "Captação & Produção",
    image: "https://mir-s3-cdn-cf.behance.net/projects/404/7cef9a166817063.Y3JvcCwxMjg0LDEwMDQsMCwzMTQ.jpg",
    span: "",
  },
  {
    id: 14,
    url: "https://www.behance.net/gallery/166816959/Versos-Poesias-Cu-Azul-(Hit-Verao-2022)",
    title: "Versos & Poesias - Céu Azul",
    desc: "Hit Verão 2022",
    image: "https://mir-s3-cdn-cf.behance.net/projects/404/53bb8d166816959.Y3JvcCwxMjg0LDEwMDQsMCwxMzM.jpg",
    span: "card-large",
  },
  {
    id: 15,
    url: "https://www.behance.net/gallery/166816739/TURBULENCIA-Sandro-B-Benne-Feat-Jenny-Brown",
    title: "TURBULÊNCIA - Sandro B & Benne",
    desc: "Feat. Jenny Brown",
    image: "https://mir-s3-cdn-cf.behance.net/projects/404/c9e5e4166816739.Y3JvcCw4ODEsNjg5LDIwMCwyMDk.jpg",
    span: "",
  },
  {
    id: 16,
    url: "https://www.behance.net/gallery/166816599/Uami-Ndongadas-Nao-assim",
    title: "Uami Ndongadas - Não é assim",
    desc: "Mix & Master",
    image: "https://mir-s3-cdn-cf.behance.net/projects/404/26e51e166816599.Y3JvcCwxMjg0LDEwMDQsMCwyNjA.jpg",
    span: "card-wide",
  },
  {
    id: 17,
    url: "https://www.behance.net/gallery/166816521/Sizy-GPS-ft-SleepyThePrince",
    title: "Sizy - GPS ft SleepyThePrince",
    desc: "Produção & Captação",
    image: "https://mir-s3-cdn-cf.behance.net/projects/404/04f055166816521.Y3JvcCwxMjg0LDEwMDQsMCwxNDY.jpg",
    span: "",
  },
  {
    id: 18,
    url: "https://www.behance.net/gallery/166816211/TE-TIRAR-Penellas-XuxuBower",
    title: "TE TIRAR - Penellas & XuxuBower",
    desc: "Direção Criativa",
    image: "https://mir-s3-cdn-cf.behance.net/projects/404/2cbbb9166816211.Y3JvcCwxMjg0LDEwMDQsMCwyMg.jpg",
    span: "card-tall",
  },
  {
    id: 19,
    url: "https://www.behance.net/gallery/166816133/Fabiolouzz-Bella",
    title: "Fabiolouzz - Bella",
    desc: "Captação & Mix",
    image: "https://mir-s3-cdn-cf.behance.net/projects/404/2af5ca166816133.Y3JvcCwzMDAwLDIzNDYsMCw2NDY.png",
    span: "",
  },
  {
    id: 20,
    url: "https://www.behance.net/gallery/166816043/Sobv-JayTee-Sin-City-(Gritos-De-Guerra)",
    title: "Sobv JayTee - Sin City",
    desc: "Gritos De Guerra",
    image: "https://mir-s3-cdn-cf.behance.net/projects/404/d217c4166816043.Y3JvcCw4NjgsNjc4LDIwOCwyMDE.jpg",
    span: "card-large",
  },
  {
    id: 21,
    url: "https://www.behance.net/gallery/166815983/Sobv-JayTee-Alucina-(feat-Penellas2-Ag-Penelas)",
    title: "Sobv JayTee - Alucina",
    desc: "feat. Penellas2 & Agé Penelas",
    image: "https://mir-s3-cdn-cf.behance.net/projects/404/828c2c166815983.Y3JvcCwxMjg0LDEwMDQsMCwxOTA.jpg",
    span: "",
  },
  {
    id: 22,
    url: "https://www.behance.net/gallery/166815521/TRINITY-3NITY-SUPERSTAR-2",
    title: "TRINITY 3NITY - SUPERSTAR 2",
    desc: "Captação & Produção",
    image: "https://mir-s3-cdn-cf.behance.net/projects/404/658f50166815521.Y3JvcCwxMjg0LDEwMDQsMCww.jpg",
    span: "card-wide",
  },
  {
    id: 23,
    url: "https://www.behance.net/gallery/166815379/Mc-Baby-Uau",
    title: "Mc Baby - Uau",
    desc: "Mix & Master",
    image: "https://mir-s3-cdn-cf.behance.net/projects/404/9c00ba166815379.Y3JvcCwxMjg0LDEwMDQsMCw3MjE.png",
    span: "card-tall",
  },
  {
    id: 24,
    url: "https://www.behance.net/gallery/166815305/Mc-Baby-Backstage-ft-Didasboy-x-Flavia",
    title: "Mc Baby - Backstage ft. Didasboy x Flavia",
    desc: "Direção Criativa",
    image: "https://mir-s3-cdn-cf.behance.net/projects/404/dd1ae4166815305.Y3JvcCwxMjg0LDEwMDQsMCw3MjE.png",
    span: "",
  },
];
