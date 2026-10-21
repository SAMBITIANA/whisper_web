export type ProposalStatus = "PENDING" | "APPROVED" | "REJECTED";

export type AdminProposal = {
  id: string;
  quote: string;
  source: string;
  author: string;
  submittedAt: string;
  status: ProposalStatus;
};

export const proposalStatusLabels: Record<ProposalStatus, string> = {
  PENDING: "En attente",
  APPROVED: "Publiée",
  REJECTED: "Rejetée",
};

export const adminProposals: AdminProposal[] = [
  {
    id: "prop-1",
    quote:
      "Une ville ne dort jamais, elle change simplement de respiration.",
    source: "Les veilleurs de la ville · Faniay",
    author: "Sam K.",
    submittedAt: "2026-10-18",
    status: "PENDING",
  },
  {
    id: "prop-2",
    quote:
      "Le silence n’est pas une absence de mots, c’est une autre façon de parler.",
    source: "Roman non identifié",
    author: "Inès B.",
    submittedAt: "2026-10-17",
    status: "PENDING",
  },
  {
    id: "prop-3",
    quote: "On ne range pas les souvenirs, on apprend à marcher autour.",
    source: "Carnet de bord · Faniay",
    author: "Nora T.",
    submittedAt: "2026-10-16",
    status: "PENDING",
  },
  {
    id: "prop-4",
    quote: "La patience est une forme de courage qui ne fait pas de bruit.",
    source: "Proverbe du vent",
    author: "Yann D.",
    submittedAt: "2026-10-15",
    status: "APPROVED",
  },
  {
    id: "prop-5",
    quote: "Chaque pas compte, même celui qu’on fait dans le noir.",
    source: "L’horizon des mots",
    author: "Camille R.",
    submittedAt: "2026-10-14",
    status: "REJECTED",
  },
];

export const pipelineStatus = [
  { label: "Transcodage HLS", value: "idle", note: "4 renditions en attente" },
  { label: "Pistes de texte", value: "idle", note: "fr, en à synchroniser" },
  { label: "Dérivés images", value: "ok", note: "WebP + AVIF à jour" },
  { label: "Génération IA", value: "ok", note: "file vide" },
];

export const recentActivity = [
  {
    when: "Il y a 12 min",
    text: "Léa M. a publié « Le poids du silence »",
  },
  {
    when: "Il y a 1 h",
    text: "Julien R. a approuvé une proposition de Sam K.",
  },
  {
    when: "Il y a 3 h",
    text: "Traduction anglaise ajoutée à « Lettre à Majala »",
  },
  {
    when: "Hier",
    text: "Nouvelle source créée : L’oiseau de pierre",
  },
];

export type AdminUser = {
  email: string;
  name: string;
  role: "ADMIN" | "EDITOR" | "USER";
  status: "Actif" | "Suspendu";
  joinedAt: string;
};

export const adminUsers: AdminUser[] = [
  {
    email: "julien@whispers.app",
    name: "Julien R.",
    role: "ADMIN" as const,
    status: "Actif" as const,
    joinedAt: "2025-11-04",
  },
  {
    email: "lea@whispers.app",
    name: "Léa M.",
    role: "EDITOR" as const,
    status: "Actif" as const,
    joinedAt: "2026-01-17",
  },
  {
    email: "sam@whispers.app",
    name: "Sam K.",
    role: "USER" as const,
    status: "Actif" as const,
    joinedAt: "2026-09-02",
  },
  {
    email: "ines@exemple.fr",
    name: "Inès B.",
    role: "USER" as const,
    status: "Actif" as const,
    joinedAt: "2026-10-12",
  },
  {
    email: "yann@exemple.fr",
    name: "Yann D.",
    role: "USER" as const,
    status: "Suspendu" as const,
    joinedAt: "2026-08-21",
  },
];

export const moderationStats = {
  views: "184,3 k",
  reactions: "12,8 k",
  pending: adminProposals.filter((item) => item.status === "PENDING").length,
  published: 13,
};
