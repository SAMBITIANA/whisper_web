import { typography } from "@/lib/format";

export type MediaKind = "VIDEO" | "IMAGE" | "SEQUENCE" | "TRACK";

export type SourceKind =
  | "FILM"
  | "SERIES"
  | "CARTOON"
  | "BOOK"
  | "SONG"
  | "SPEECH"
  | "PROVERB"
  | "PERSONAL";

export type LanguageCode = "fr" | "en";

export type FakeSource = {
  slug: string;
  kind: SourceKind;
  title: string;
  poster?: string;
  year?: number;
  author?: string;
  character?: string;
  locator?: string;
};

export type FakeMedia = {
  slug: string;
  kind: MediaKind;
  title: string;
  quote: Record<LanguageCode, string>;
  source: FakeSource;
  topics: string[];
  mood: string;
  durationSec: number;
  views: number;
  likes: number;
  comments: number;
  publishedAt: string;
  poster: string;
  gradient: string;
  items?: number;
  language?: string;
  featured?: boolean;
  community?: boolean;
};

export const languages: { code: LanguageCode; label: string }[] = [
  { code: "fr", label: "Français" },
  { code: "en", label: "English" },
];

export const sourceLabels: Record<SourceKind, string> = {
  FILM: "Film",
  SERIES: "Série",
  CARTOON: "Dessin animé",
  BOOK: "Livre",
  SONG: "Chanson",
  SPEECH: "Discours",
  PROVERB: "Proverbe",
  PERSONAL: "Citation personnelle",
};

export const mediaKindLabels: Record<MediaKind, string> = {
  VIDEO: "Vidéo",
  IMAGE: "Image",
  SEQUENCE: "Galerie",
  TRACK: "Chanson",
};

export const media: FakeMedia[] = [
  {
    slug: "dernier-train-de-minuit",
    kind: "VIDEO",
    title: "Le dernier train de minuit",
    quote: {
      fr: "Ce n'est pas parce qu'on a perdu le chemin qu'il faut s'arrêter de marcher.",
      en: "It is not because we lost the way that we must stop walking.",
    },
    source: {
      slug: "dernier-train-de-minuit",
      poster: "/media/sources/dernier-train-de-minuit.jpg",
      kind: "FILM",
      title: "Le dernier train de minuit",
      year: 1998,
      author: "Aïcha Rakotomalala",
      character: "Le Chef de gare",
      locator: "01:12",
    },
    topics: ["Persévérance", "Voyage"],
    mood: "Calme",
    durationSec: 42,
    views: 184320,
    likes: 12840,
    comments: 312,
    publishedAt: "2026-10-18",
    poster: "/media/dernier-train-de-minuit.jpg",
  gradient: "from-[#2B5748] via-[#618764] to-[#9CB080]",
    featured: true,
  },
  {
    slug: "horizon-des-mots",
    kind: "IMAGE",
    title: "L'horizon des mots",
    quote: {
      fr: "Un mot juste posé au bon endroit vaut une bibliothèque entière.",
      en: "A single word, set in the right place, is worth a whole library.",
    },
    source: {
      slug: "horizon-des-mots",
      poster: "/media/sources/horizon-des-mots.jpg",
      kind: "BOOK",
      title: "L'horizon des mots",
      year: 2011,
      author: "Velomanitra R.",
      locator: "p. 84",
    },
    topics: ["Lecture", "Écriture"],
    mood: "Réfléchi",
    durationSec: 0,
    views: 96410,
    likes: 9310,
    comments: 148,
    publishedAt: "2026-10-15",
    poster: "/media/horizon-des-mots.jpg",
  gradient: "from-[#618764] via-[#9CB080] to-[#F5F4EC]",
  },
  {
    slug: "etoiles-de-niora",
    kind: "SEQUENCE",
    title: "Les étoiles de Niora",
    quote: {
      fr: "On ne choisit pas ses étoiles, on choisit la direction dans laquelle on les suit.",
      en: "We do not choose our stars, we choose the direction in which we follow them.",
    },
    source: {
      slug: "etoiles-de-niora",
      poster: "/media/sources/etoiles-de-niora.jpg",
      kind: "CARTOON",
      title: "Les étoiles de Niora",
      year: 2019,
      author: "Studio Kalando",
      character: "Niora",
      locator: "ép. 12",
    },
    topics: ["Rêve", "Amitié"],
    mood: "Lumineux",
    durationSec: 27,
    views: 240880,
    likes: 21460,
    comments: 502,
    publishedAt: "2026-10-19",
    poster: "/media/etoiles-de-niora.jpg",
  gradient: "from-[#273338] via-[#2B5748] to-[#618764]",
    items: 6,
    featured: true,
  },
  {
    slug: "la-derniere-vague",
    kind: "TRACK",
    title: "La dernière vague",
    quote: {
      fr: "Je chante sous la pluie parce que la pluie n'a jamais eu peur de ma voix.",
      en: "I sing in the rain because the rain was never afraid of my voice.",
    },
    source: {
      slug: "la-derniere-vague",
      poster: "/media/sources/la-derniere-vague.jpg",
      kind: "SONG",
      title: "La dernière vague",
      year: 2024,
      author: "Hanta Andrianina",
      locator: "couplet 2",
    },
    topics: ["Musique", "Liberté"],
    mood: "Énergique",
    durationSec: 154,
    views: 132770,
    likes: 15620,
    comments: 274,
    publishedAt: "2026-10-12",
    poster: "/media/la-derniere-vague.jpg",
  gradient: "from-[#273338] via-[#2B5748] to-[#9CB080]",
    language: "Malagasy",
  },
  {
    slug: "le-poids-du-silence",
    kind: "VIDEO",
    title: "Le poids du silence",
    quote: {
      fr: "Le silence n'est pas l'absence de voix, c'est une décision de la porter.",
      en: "Silence is not the absence of a voice, it is a decision to carry it.",
    },
    source: {
      slug: "poids-du-silence",
      kind: "FILM",
      title: "Le poids du silence",
      year: 2006,
      author: "Serge Rakoto",
      character: "Naina",
      locator: "00:48",
    },
    topics: ["Silence", "Résilience"],
    mood: "Introspection",
    durationSec: 68,
    views: 74220,
    likes: 6890,
    comments: 96,
    publishedAt: "2026-10-10",
    poster: "/media/le-poids-du-silence.jpg",
  gradient: "from-[#273338] via-[#2B5748] to-[#618764]",
  },
  {
    slug: "proverbe-du-vent",
    kind: "IMAGE",
    title: "Proverbe du vent",
    quote: {
      fr: "Celui qui plie le vent ne le combat pas, il l'écoute.",
      en: "He who bends the wind does not fight it, he listens to it.",
    },
    source: {
      slug: "proverbe-du-vent",
      poster: "/media/sources/proverbe-du-vent.jpg",
      kind: "PROVERB",
      title: "Proverbe du vent",
    },
    topics: ["Sagesse", "Nature"],
    mood: "Serein",
    durationSec: 0,
    views: 51200,
    likes: 6040,
    comments: 71,
    publishedAt: "2026-10-08",
    poster: "/media/proverbe-du-vent.jpg",
  gradient: "from-[#618764] via-[#9CB080] to-[#F5F4EC]",
  },
  {
    slug: "lettre-a-majala",
    kind: "VIDEO",
    title: "Lettre à Majala",
    quote: {
      fr: "Je t'écris parce que mes mains n'ont plus rien à dire.",
      en: "I write to you because my hands have nothing left to say.",
    },
    source: {
      slug: "lettre-a-majala",
      poster: "/media/sources/lettre-a-majala.jpg",
      kind: "BOOK",
      title: "Lettre à Majala",
      year: 2018,
      author: "Fara Rasoanaivo",
      locator: "chap. 3",
    },
    topics: ["Amitié", "Lettre"],
    mood: "Tendre",
    durationSec: 55,
    views: 118900,
    likes: 11240,
    comments: 231,
    publishedAt: "2026-10-17",
    poster: "/media/lettre-a-majala.jpg",
  gradient: "from-[#2B5748] via-[#618764] to-[#9CB080]",
    featured: true,
  },
  {
    slug: "les-veilleurs-de-la-ville",
    kind: "SEQUENCE",
    title: "Les veilleurs de la ville",
    quote: {
      fr: "Une ville ne dort jamais, elle change simplement de respiration.",
      en: "A city never sleeps, it simply changes its breathing.",
    },
    source: {
      slug: "les-veilleurs-de-la-ville",
      poster: "/media/sources/les-veilleurs-de-la-ville.jpg",
      kind: "SERIES",
      title: "Les veilleurs de la ville",
      year: 2021,
      author: "Lova Channel",
      character: "Faniry",
      locator: "ép. 4",
    },
    topics: ["Ville", "Nuit"],
    mood: "Nocturne",
    durationSec: 34,
    views: 88940,
    likes: 7320,
    comments: 118,
    publishedAt: "2026-10-16",
    poster: "/media/les-veilleurs-de-la-ville.jpg",
  gradient: "from-[#273338] via-[#2B5748] to-[#9CB080]",
    items: 8,
  },
  {
    slug: "discours-de-la-renaissance",
    kind: "VIDEO",
    title: "Discours de la renaissance",
    quote: {
      fr: "Ce que nous reconstruisons aujourd'hui portera nos noms demain.",
      en: "What we rebuild today will carry our names tomorrow.",
    },
    source: {
      slug: "discours-de-la-renaissance",
      poster: "/media/sources/discours-de-la-renaissance.jpg",
      kind: "SPEECH",
      title: "Discours de la renaissance",
      year: 1994,
      author: "Élise Rakotondrabe",
    },
    topics: ["Histoire", "Courage"],
    mood: "Solennel",
    durationSec: 96,
    views: 46300,
    likes: 3980,
    comments: 52,
    publishedAt: "2026-10-05",
    poster: "/media/discours-de-la-renaissance.jpg",
  gradient: "from-[#2B5748] via-[#618764] to-[#9CB080]",
  },
  {
    slug: "ma-citation-de-ce-matin",
    kind: "IMAGE",
    title: "Ma citation de ce matin",
    quote: {
      fr: "Je commence par ce qui me fait plaisir, j'aurai le temps pour le reste.",
      en: "I start with what I enjoy, I will have time for the rest.",
    },
    source: {
      slug: "ma-citation-de-ce-matin",
      poster: "/media/sources/ma-citation-de-ce-matin.jpg",
      kind: "PERSONAL",
      title: "Ma citation de ce matin",
    },
    topics: ["Motivation"],
    mood: "Personnel",
    durationSec: 0,
    views: 12300,
    likes: 1890,
    comments: 24,
    publishedAt: "2026-10-20",
    poster: "/media/ma-citation-de-ce-matin.jpg",
  gradient: "from-[#9CB080] via-[#618764] to-[#2B5748]",
    community: true,
  },
  {
    slug: "le-garcon-de-la-pluie",
    kind: "SEQUENCE",
    title: "Le garçon de la pluie",
    quote: {
      fr: "Attendre sous la pluie, c'est déjà croire qu'elle s'arrêtera.",
      en: "Waiting in the rain already means believing it will stop.",
    },
    source: {
      slug: "le-garcon-de-la-pluie",
      poster: "/media/sources/le-garcon-de-la-pluie.jpg",
      kind: "CARTOON",
      title: "Le garçon de la pluie",
      year: 2015,
      author: "Studio Kalando",
      character: "Tiana",
      locator: "ép. 7",
    },
    topics: ["Espoir", "Nature"],
    mood: "Doux",
    durationSec: 31,
    views: 67400,
    likes: 5880,
    comments: 87,
    publishedAt: "2026-10-14",
    poster: "/media/le-garcon-de-la-pluie.jpg",
  gradient: "from-[#273338] via-[#2B5748] to-[#9CB080]",
    items: 5,
  },
  {
    slug: "carnet-de-bord",
    kind: "TRACK",
    title: "Carnet de bord",
    quote: {
      fr: "J'écris pour me souvenir du chemin, pas pour l'effacer.",
      en: "I write to remember the way, not to erase it.",
    },
    source: {
      slug: "carnet-de-bord",
      poster: "/media/sources/carnet-de-bord.jpg",
      kind: "SONG",
      title: "Carnet de bord",
      year: 2025,
      author: "Hanta Andrianina",
      locator: "refrain",
    },
    topics: ["Mémoire", "Écriture"],
    mood: "Mélancolique",
    durationSec: 178,
    views: 39210,
    likes: 4210,
    comments: 63,
    publishedAt: "2026-10-11",
    poster: "/media/carnet-de-bord.jpg",
  gradient: "from-[#273338] via-[#2B5748] to-[#618764]",
    language: "Français",
  },
  {
    slug: "oiseau-de-pierre",
    kind: "VIDEO",
    title: "L'oiseau de pierre",
    quote: {
      fr: "Un oiseau de pierre n'a pas besoin de savoir voler pour choisir sa branche.",
      en: "A stone bird does not need to know how to fly to choose its branch.",
    },
    source: {
      slug: "oiseau-de-pierre",
      poster: "/media/sources/oiseau-de-pierre.jpg",
      kind: "FILM",
      title: "L'oiseau de pierre",
      year: 2003,
      author: "Serge Rakoto",
      character: "Le père",
      locator: "02:21",
    },
    topics: ["Liberté", "Nature"],
    mood: "Contemplatif",
    durationSec: 73,
    views: 55800,
    likes: 4970,
    comments: 74,
    publishedAt: "2026-10-09",
    poster: "/media/oiseau-de-pierre.jpg",
  gradient: "from-[#2B5748] via-[#618764] to-[#9CB080]",
  },
  {
    slug: "veilleuse",
    kind: "IMAGE",
    title: "La veilleuse",
    quote: {
      fr: "La nuit, les mots se relisent à voix basse.",
      en: "At night, words are reread in a whisper.",
    },
    source: {
      slug: "horizon-des-mots",
      poster: "/media/sources/horizon-des-mots.jpg",
      kind: "BOOK",
      title: "L'horizon des mots",
      year: 2011,
      author: "Velomanitra R.",
      locator: "p. 112",
    },
    topics: ["Lecture", "Nuit"],
    mood: "Réfléchi",
    durationSec: 0,
    views: 4210,
    likes: 640,
    comments: 12,
    publishedAt: "2026-10-19",
    poster: "/media/veilleuse.jpg",
  gradient: "from-[#273338] via-[#2B5748] to-[#618764]",
    community: true,
  },
  {
    slug: "la-route-rouge",
    kind: "IMAGE",
    title: "La route rouge",
    quote: {
      fr: "On ne traverse pas un désert, on apprend à marcher avec lui.",
      en: "You do not cross a desert, you learn to walk with it.",
    },
    source: {
      slug: "proverbe-du-vent",
      poster: "/media/sources/proverbe-du-vent.jpg",
      kind: "PROVERB",
      title: "Proverbe du vent",
    },
    topics: ["Voyage", "Persévérance"],
    mood: "Contemplatif",
    durationSec: 0,
    views: 3180,
    likes: 470,
    comments: 9,
    publishedAt: "2026-10-17",
    poster: "/media/la-route-rouge.jpg",
  gradient: "from-[#B4653A] via-[#9A5A3C] to-[#273338]",
    community: true,
  },
];

export const topics = Array.from(
  new Set(media.flatMap((item) => item.topics)),
).sort();

export const moods = Array.from(new Set(media.map((item) => item.mood))).sort();

export const sources = Array.from(
  new Map(media.map((item) => [item.source.slug, item.source])).values(),
);

export function getMedia(slug: string): FakeMedia | undefined {
  return media.find((item) => item.slug === slug);
}

export function getSource(slug: string): FakeSource | undefined {
  return sources.find((item) => item.slug === slug);
}

export function getMediaBySource(sourceSlug: string): FakeMedia[] {
  return media.filter((item) => item.source.slug === sourceSlug);
}

export function getSourcePoster(sourceSlug: string): string | undefined {
  return (
    getSource(sourceSlug)?.poster ?? getMediaBySource(sourceSlug)[0]?.poster
  );
}

export function getQuote(
  item: FakeMedia,
  language: LanguageCode,
): string {
  return typography(item.quote[language] ?? item.quote.fr);
}
