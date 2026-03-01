export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  objective: string[];
  price: number;
  oldPrice?: number;
  image: string;
  flavors: string[];
  weights: string[];
  description: string;
  nutritionFacts: { label: string; value: string }[];
  inStock: boolean;
  isTopSale?: boolean;
  isPromo?: boolean;
  rating: number;
  reviews: number;
}

export const categories = [
  { id: "whey", label: "Whey Protein", icon: "💪" },
  { id: "creatine", label: "Créatine", icon: "⚡" },
  { id: "gainer", label: "Gainer", icon: "🏋️" },
  { id: "seche", label: "Sèche", icon: "🔥" },
  { id: "masse", label: "Prise de Masse", icon: "💥" },
  { id: "packs", label: "Nos Packs", icon: "📦" },
  { id: "accessoires", label: "Accessoires", icon: "🎒" },
];

export const brands = ["Optimum Nutrition", "MuscleTech", "BSN", "Dymatize", "MyProtein", "BioTech USA"];
export const flavors = ["Chocolat", "Vanille", "Fraise", "Cookie", "Caramel", "Nature"];
export const weights = ["500g", "1kg", "2kg", "2.27kg", "5kg"];
export const objectives = ["Prise de masse", "Sèche", "Endurance", "Force", "Récupération"];

export const products: Product[] = [
  {
    id: "1",
    name: "Gold Standard 100% Whey",
    brand: "Optimum Nutrition",
    category: "whey",
    objective: ["Prise de masse", "Récupération"],
    price: 8500,
    oldPrice: 9500,
    image: "whey",
    flavors: ["Chocolat", "Vanille", "Cookie"],
    weights: ["908g", "2.27kg"],
    description: "La whey la plus vendue au monde. 24g de protéines par dose, faible en gras et en sucre. Idéale pour la récupération musculaire après l'entraînement.",
    nutritionFacts: [
      { label: "Protéines", value: "24g" },
      { label: "Calories", value: "120 kcal" },
      { label: "BCAA", value: "5.5g" },
      { label: "Glutamine", value: "4g" },
      { label: "Sucre", value: "1g" },
      { label: "Gras", value: "1.5g" },
    ],
    inStock: true,
    isTopSale: true,
    isPromo: true,
    rating: 4.8,
    reviews: 234,
  },
  {
    id: "2",
    name: "Creatine Monohydrate",
    brand: "Optimum Nutrition",
    category: "creatine",
    objective: ["Force", "Prise de masse"],
    price: 3500,
    image: "creatine",
    flavors: ["Nature"],
    weights: ["300g", "600g"],
    description: "Créatine monohydrate pure micronisée. Augmente la force, la puissance et le volume musculaire. 5g par dose.",
    nutritionFacts: [
      { label: "Créatine", value: "5g" },
      { label: "Calories", value: "0 kcal" },
      { label: "Pureté", value: "99.9%" },
    ],
    inStock: true,
    isTopSale: true,
    rating: 4.9,
    reviews: 189,
  },
  {
    id: "3",
    name: "Serious Mass",
    brand: "Optimum Nutrition",
    category: "gainer",
    objective: ["Prise de masse"],
    price: 7200,
    oldPrice: 8000,
    image: "gainer",
    flavors: ["Chocolat", "Vanille", "Fraise"],
    weights: ["2.72kg", "5.44kg"],
    description: "Le gainer ultime pour les hardgainers. 1250 calories par dose avec 50g de protéines. Idéal pour la prise de masse rapide.",
    nutritionFacts: [
      { label: "Protéines", value: "50g" },
      { label: "Calories", value: "1250 kcal" },
      { label: "Glucides", value: "252g" },
      { label: "Créatine", value: "3g" },
      { label: "Glutamine", value: "3g" },
    ],
    inStock: true,
    isPromo: true,
    rating: 4.6,
    reviews: 156,
  },
  {
    id: "4",
    name: "C4 Original Pre-Workout",
    brand: "Cellucor",
    category: "seche",
    objective: ["Endurance", "Force"],
    price: 5800,
    image: "preworkout",
    flavors: ["Fruit Punch", "Pastèque", "Fraise"],
    weights: ["195g", "390g"],
    description: "Le pre-workout N°1 en Amérique. Énergie explosive, focus mental intense et pompes musculaires incroyables.",
    nutritionFacts: [
      { label: "Caféine", value: "150mg" },
      { label: "Beta-Alanine", value: "1.6g" },
      { label: "Créatine NO3", value: "1g" },
      { label: "Arginine AKG", value: "1g" },
    ],
    inStock: true,
    isTopSale: true,
    rating: 4.7,
    reviews: 98,
  },
  {
    id: "5",
    name: "BCAA Energy",
    brand: "BSN",
    category: "whey",
    objective: ["Récupération", "Endurance"],
    price: 4200,
    image: "bcaa",
    flavors: ["Mangue", "Pastèque", "Fruit Punch"],
    weights: ["300g", "600g"],
    description: "BCAA 2:1:1 avec ajout d'énergie naturelle. Réduit la fatigue musculaire et accélère la récupération.",
    nutritionFacts: [
      { label: "Leucine", value: "3.5g" },
      { label: "Isoleucine", value: "1.75g" },
      { label: "Valine", value: "1.75g" },
      { label: "Caféine", value: "125mg" },
    ],
    inStock: true,
    rating: 4.5,
    reviews: 67,
  },
  {
    id: "6",
    name: "Hydroxycut Hardcore",
    brand: "MuscleTech",
    category: "seche",
    objective: ["Sèche"],
    price: 4800,
    oldPrice: 5500,
    image: "fatburner",
    flavors: [],
    weights: ["60 caps", "120 caps"],
    description: "Le brûleur de graisse le plus puissant de MuscleTech. Thermogénique avancé pour une sèche extrême.",
    nutritionFacts: [
      { label: "Caféine", value: "270mg" },
      { label: "C. canephora", value: "200mg" },
      { label: "Coleus", value: "100mg" },
    ],
    inStock: true,
    isPromo: true,
    rating: 4.4,
    reviews: 112,
  },
  {
    id: "7",
    name: "ISO100 Hydrolyzed",
    brand: "Dymatize",
    category: "whey",
    objective: ["Sèche", "Récupération"],
    price: 11500,
    image: "whey",
    flavors: ["Chocolat", "Vanille", "Cookie"],
    weights: ["900g", "2.27kg"],
    description: "Whey isolate hydrolysée ultra-pure. 25g de protéines, 0g de sucre. La protéine la plus rapide à absorber.",
    nutritionFacts: [
      { label: "Protéines", value: "25g" },
      { label: "Calories", value: "110 kcal" },
      { label: "Sucre", value: "0g" },
      { label: "Gras", value: "0.5g" },
      { label: "BCAA", value: "5.5g" },
    ],
    inStock: true,
    rating: 4.9,
    reviews: 201,
  },
  {
    id: "8",
    name: "Impact Whey Protein",
    brand: "MyProtein",
    category: "whey",
    objective: ["Prise de masse", "Récupération"],
    price: 6200,
    image: "whey",
    flavors: ["Chocolat", "Vanille", "Caramel", "Fraise"],
    weights: ["1kg", "2.5kg", "5kg"],
    description: "Whey concentrée de haute qualité à prix imbattable. 21g de protéines par dose. Le meilleur rapport qualité-prix.",
    nutritionFacts: [
      { label: "Protéines", value: "21g" },
      { label: "Calories", value: "103 kcal" },
      { label: "BCAA", value: "4.5g" },
      { label: "Glutamine", value: "3.6g" },
    ],
    inStock: true,
    isTopSale: true,
    rating: 4.6,
    reviews: 324,
  },
];

export const wilayas = [
  "Adrar", "Chlef", "Laghouat", "Oum El Bouaghi", "Batna", "Béjaïa", "Biskra",
  "Béchar", "Blida", "Bouira", "Tamanrasset", "Tébessa", "Tlemcen", "Tiaret",
  "Tizi Ouzou", "Alger", "Djelfa", "Jijel", "Sétif", "Saïda", "Skikda",
  "Sidi Bel Abbès", "Annaba", "Guelma", "Constantine", "Médéa", "Mostaganem",
  "M'Sila", "Mascara", "Ouargla", "Oran", "El Bayadh", "Illizi", "Bordj Bou Arréridj",
  "Boumerdès", "El Tarf", "Tindouf", "Tissemsilt", "El Oued", "Khenchela",
  "Souk Ahras", "Tipaza", "Mila", "Aïn Defla", "Naâma", "Aïn Témouchent",
  "Ghardaïa", "Relizane"
];

export const testimonials = [
  { name: "Karim B.", city: "Alger", text: "Produits 100% authentiques, livrés en 2 jours ! La meilleure boutique en Algérie.", rating: 5 },
  { name: "Sofiane M.", city: "Oran", text: "La whey Gold Standard a changé mes entraînements. Service client top via WhatsApp.", rating: 5 },
  { name: "Yacine D.", city: "Constantine", text: "Prix imbattables et livraison rapide même à Constantine. Je recommande à 100% !", rating: 5 },
  { name: "Amine R.", city: "Sétif", text: "J'ai créé mon pack masse et j'ai pris 5kg en 2 mois. Merci Ultra Nutrition !", rating: 4 },
];

export function getProductImage(imageKey: string): string {
  return imageKey;
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("fr-DZ").format(price) + " DZD";
}
