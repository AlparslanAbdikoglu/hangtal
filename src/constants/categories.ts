export type KnownCategory = {
  slug: string;
  name: string;
  image?: string;
};

export const HOMEPAGE_CATEGORY_IMAGE = "/images/vizjeles_logo.webp";

export const KNOWN_CATEGORIES: KnownCategory[] = [
  { slug: "gongs-tam-tams", name: "Gongok" },
  { slug: "hangvillak", name: "Hangvillák" },
  { slug: "himalaja-tal", name: "Himalájai Hangtálak" },
  { slug: "bowls", name: "Kristály Hangtálak és kelyhek" },
  { slug: "calimbas", name: "Kalimbák" },
  { slug: "handpans", name: "Handpanak" },
  { slug: "accessory", name: "Kiegészítők" },
  { slug: "drums", name: "Acél Nyelv Dobok" },
  { slug: "main-drums", name: "Dobok" },
  { slug: "chime", name: "Chimeok-Hangjátékok" },
  { slug: "effects", name: "Hang effektek" },
  { slug: "didgeridoo", name: "Didgeridoo" },
  { slug: "energia-rudak", name: "Energia rudak" },
  { slug: "tree-sound", name: "Üdők, dörzsfák" },
  { slug: "bags-etc", name: "Táskák, tokok, huzatok" },
  { slug: "stands", name: "Állványok" },
];

export const CATEGORY_ORDER_MAP = new Map(
  KNOWN_CATEGORIES.map((category, index) => [category.slug, index] as const)
);
