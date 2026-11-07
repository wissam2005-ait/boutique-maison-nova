export type Category = "audio" | "montres" | "maroquinerie" | "maison" | "beaute" | "chaussures";

export type Product = {
  slug: string;
  name: string;
  category: Category;
  price: number;
  compareAt?: number;
  image: string;
  hue: number; // fallback color if the image fails to load
  rating: number;
  reviews: number;
  stock: number;
  badge?: string;
  featured?: boolean;
  short: string;
  description: string;
  details: string[];
};

export const categories: { id: Category; label: string; emoji: string }[] = [
  { id: "audio", label: "Audio", emoji: "🎧" },
  { id: "montres", label: "Montres", emoji: "⌚" },
  { id: "maroquinerie", label: "Maroquinerie", emoji: "👜" },
  { id: "chaussures", label: "Chaussures", emoji: "👟" },
  { id: "maison", label: "Maison", emoji: "🪴" },
  { id: "beaute", label: "Beauté", emoji: "🧴" },
];

const u = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=80`;

export const products: Product[] = [
  {
    slug: "casque-studio-sans-fil",
    name: "Casque Studio sans fil",
    category: "audio",
    price: 189,
    compareAt: 229,
    image: u("photo-1505740420928-5e560c06d30e"),
    hue: 30,
    rating: 4.8,
    reviews: 312,
    stock: 24,
    badge: "-17 %",
    featured: true,
    short: "Réduction de bruit active, 40 h d'autonomie.",
    description:
      "Un son riche et équilibré, une réduction de bruit active qui s'adapte à votre environnement et des coussinets à mémoire de forme pour des heures d'écoute sans fatigue.",
    details: ["Bluetooth 5.3 multipoint", "40 h d'autonomie, charge rapide USB‑C", "Pliable, étui inclus", "Garantie 2 ans"],
  },
  {
    slug: "montre-minimaliste-acier",
    name: "Montre minimaliste acier",
    category: "montres",
    price: 149,
    image: u("photo-1523275335684-37898b6baf30"),
    hue: 0,
    rating: 4.7,
    reviews: 128,
    stock: 12,
    featured: true,
    short: "Cadran épuré, verre saphir, étanche 5 ATM.",
    description:
      "Un cadran épuré de 38 mm, un boîtier en acier inoxydable brossé et un verre saphir inrayable. La montre que l'on garde toute une vie.",
    details: ["Mouvement quartz japonais", "Verre saphir", "Étanche 5 ATM", "Bracelet interchangeable"],
  },
  {
    slug: "baskets-urbaines-rouges",
    name: "Baskets urbaines",
    category: "chaussures",
    price: 119,
    compareAt: 139,
    image: u("photo-1542291026-7eec264c27ff"),
    hue: 5,
    rating: 4.6,
    reviews: 541,
    stock: 40,
    badge: "Best‑seller",
    featured: true,
    short: "Légères, respirantes, amorti réactif.",
    description:
      "Une tige en mesh respirant, une semelle à amorti réactif et un design intemporel. Parfaites pour la ville comme pour le week‑end.",
    details: ["Mesh recyclé", "Semelle caoutchouc", "Pointures 36 à 46", "Retours gratuits"],
  },
  {
    slug: "appareil-photo-instantane",
    name: "Appareil photo instantané",
    category: "audio",
    price: 99,
    image: u("photo-1526170375885-4d8ecf77b99f"),
    hue: 190,
    rating: 4.5,
    reviews: 87,
    stock: 8,
    badge: "Nouveau",
    short: "Vos souvenirs imprimés en quelques secondes.",
    description:
      "Capturez l'instant et tenez‑le entre vos mains en quelques secondes. Flash automatique, mode selfie et format carte de crédit.",
    details: ["Impression en 90 s", "Mode selfie et miroir", "Batterie rechargeable", "10 films offerts"],
  },
  {
    slug: "lunettes-de-soleil-ecaille",
    name: "Lunettes de soleil écaille",
    category: "maroquinerie",
    price: 79,
    image: u("photo-1572635196237-14b3f281503f"),
    hue: 40,
    rating: 4.4,
    reviews: 64,
    stock: 30,
    short: "Verres polarisés UV400, monture acétate.",
    description:
      "Une monture en acétate écaille faite main et des verres polarisés UV400 pour une protection totale avec style.",
    details: ["Verres polarisés catégorie 3", "Acétate biosourcé", "Étui en cuir inclus"],
  },
  {
    slug: "sac-cabas-cuir",
    name: "Sac cabas en cuir",
    category: "maroquinerie",
    price: 245,
    image: u("photo-1553062407-98eeb64c6a62"),
    hue: 25,
    rating: 4.9,
    reviews: 203,
    stock: 6,
    featured: true,
    short: "Cuir pleine fleur tanné végétal.",
    description:
      "Un cabas spacieux en cuir pleine fleur au tannage végétal, qui se patine magnifiquement avec le temps. Poche intérieure zippée et anses renforcées.",
    details: ["Cuir pleine fleur", "Dimensions 38 × 30 × 14 cm", "Fabriqué au Portugal"],
  },
  {
    slug: "bouteille-isotherme",
    name: "Bouteille isotherme 750 ml",
    category: "maison",
    price: 35,
    image: u("photo-1602143407151-7111542de6e8"),
    hue: 160,
    rating: 4.7,
    reviews: 412,
    stock: 120,
    short: "24 h froid, 12 h chaud, zéro plastique.",
    description:
      "Double paroi en acier inoxydable : vos boissons restent fraîches 24 h ou chaudes 12 h. Étanche, sans BPA et indestructible.",
    details: ["Acier inoxydable 18/8", "Sans BPA", "Passe au lave‑vaisselle"],
  },
  {
    slug: "plante-monstera-pot",
    name: "Monstera & pot céramique",
    category: "maison",
    price: 59,
    image: u("photo-1614594975525-e45190c55d0b"),
    hue: 130,
    rating: 4.6,
    reviews: 95,
    stock: 15,
    short: "Une touche de vert, livrée prête à vivre.",
    description:
      "Une Monstera deliciosa en pleine santé, livrée dans un pot en céramique émaillée artisanale. Guide d'entretien inclus.",
    details: ["Hauteur ~60 cm", "Pot Ø 17 cm", "Livraison protégée"],
  },
  {
    slug: "serum-eclat-vitamine-c",
    name: "Sérum éclat vitamine C",
    category: "beaute",
    price: 42,
    compareAt: 49,
    image: u("photo-1620916566398-39f1143ab7be"),
    hue: 45,
    rating: 4.8,
    reviews: 678,
    stock: 55,
    badge: "-14 %",
    featured: true,
    short: "Teint lumineux en 4 semaines.",
    description:
      "15 % de vitamine C stabilisée et acide hyaluronique pour un teint plus lumineux, uniforme et repulpé. Formule vegan, made in France.",
    details: ["30 ml", "Vegan & cruelty‑free", "Fabriqué en France"],
  },
  {
    slug: "parfum-bois-ambre",
    name: "Eau de parfum Bois & Ambre",
    category: "beaute",
    price: 85,
    image: u("photo-1594035910387-fea47794261f"),
    hue: 35,
    rating: 4.5,
    reviews: 142,
    stock: 20,
    short: "Notes boisées, chaudes et enveloppantes.",
    description:
      "Un sillage boisé et ambré, relevé de cardamome et adouci de vanille. Une signature élégante pour toutes les saisons.",
    details: ["50 ml", "Concentration 18 %", "Flacon rechargeable"],
  },
  {
    slug: "enceinte-bluetooth-portable",
    name: "Enceinte Bluetooth portable",
    category: "audio",
    price: 69,
    image: u("photo-1608043152269-423dbba4e7e1"),
    hue: 210,
    rating: 4.4,
    reviews: 233,
    stock: 0,
    short: "Son 360°, étanche IP67.",
    description:
      "Un son 360° puissant dans un format compact. Étanche IP67, elle vous suit à la plage comme sous la douche.",
    details: ["Autonomie 15 h", "IP67", "Appairage stéréo"],
  },
  {
    slug: "sneakers-blanches-cuir",
    name: "Sneakers cuir blanc",
    category: "chaussures",
    price: 129,
    image: u("photo-1600185365483-26d7a4cc7519"),
    hue: 220,
    rating: 4.7,
    reviews: 389,
    stock: 18,
    short: "Le basique parfait, en cuir premium.",
    description:
      "Une silhouette épurée en cuir nappa premium, cousue sur une semelle cupsole. Le basique qui va avec tout.",
    details: ["Cuir nappa", "Doublure cuir", "Semelle cousue Margom"],
  },
];

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function categoryLabel(id: Category) {
  return categories.find((c) => c.id === id)?.label ?? id;
}
