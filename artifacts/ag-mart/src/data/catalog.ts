export type Category = {
  id: string;
  name: string;
  emoji: string;
};

export type Vendor = {
  id: string;
  name: string;
  location: string;
  rating: number;
  verified: boolean;
  description: string;
};

export type Product = {
  id: string;
  name: string;
  vendorId: string;
  categoryId: string;
  price: number;
  originalPrice?: number;
  unit: string;
  stock: number;
  rating: number;
  image: string;
  description: string;
  tags?: string[];
};

export const categories: Category[] = [
  { id: "vegetables", name: "Vegetables", emoji: "🥬" },
  { id: "fruits", name: "Fruits", emoji: "🍎" },
  { id: "grains", name: "Grains & Cereals", emoji: "🌾" },
  { id: "livestock", name: "Livestock", emoji: "🐓" },
  { id: "dairy", name: "Dairy & Eggs", emoji: "🥚" },
  { id: "tubers", name: "Tubers", emoji: "🥔" },
  { id: "spices", name: "Spices & Herbs", emoji: "🌶️" },
  { id: "inputs", name: "Farm Inputs", emoji: "🧪" },
];

export const vendors: Vendor[] = [
  { id: "v1", name: "Green Valley Farms", location: "Plateau State", rating: 4.9, verified: true, description: "Family-owned organic vegetable farm operating since 2008." },
  { id: "v2", name: "Sunrise Poultry Co.", location: "Ogun State", rating: 4.8, verified: true, description: "Free-range broilers and farm-fresh eggs delivered weekly." },
  { id: "v3", name: "Northern Grain Hub", location: "Kano State", rating: 4.7, verified: true, description: "Direct-from-farm rice, millet, and sorghum at wholesale prices." },
  { id: "v4", name: "Coastal Fruit Co-op", location: "Cross River State", rating: 4.6, verified: false, description: "A co-op of 40+ smallholder fruit farmers." },
  { id: "v5", name: "Heritage Dairy", location: "Kaduna State", rating: 4.9, verified: true, description: "Grass-fed dairy products from heritage breeds." },
];

const img = (q: string) =>
  `https://images.unsplash.com/${q}?auto=format&fit=crop&w=800&q=80`;

export const products: Product[] = [
  { id: "p1", name: "Fresh Tomatoes", vendorId: "v1", categoryId: "vegetables", price: 1200, originalPrice: 1800, unit: "basket (5kg)", stock: 42, rating: 4.8, image: img("photo-1592924357228-91a4daadcfea"), description: "Vine-ripened plum tomatoes harvested at peak freshness. Great for stews, sauces and salads.", tags: ["organic", "harvest fresh"] },
  { id: "p2", name: "Sweet Pineapples", vendorId: "v4", categoryId: "fruits", price: 700, originalPrice: 1000, unit: "each", stock: 120, rating: 4.7, image: img("photo-1550258987-190a2d41a8ba"), description: "Tree-ripened sweet pineapples from coastal farms. Naturally sweet, no additives.", tags: ["sweet", "tropical"] },
  { id: "p3", name: "Brown Rice (Local)", vendorId: "v3", categoryId: "grains", price: 38000, originalPrice: 45000, unit: "50kg bag", stock: 18, rating: 4.9, image: img("photo-1586201375761-83865001e31c"), description: "Locally sourced parboiled brown rice. Stone-free and properly destoned.", tags: ["bulk", "wholesale"] },
  { id: "p4", name: "Live Broiler Chicken", vendorId: "v2", categoryId: "livestock", price: 6500, unit: "bird (~2kg)", stock: 60, rating: 4.8, image: img("photo-1612170153139-6f881ff067e0"), description: "Free-range broilers raised without antibiotics. Sold live or dressed.", tags: ["free-range"] },
  { id: "p5", name: "Crate of Eggs", vendorId: "v2", categoryId: "dairy", price: 4800, originalPrice: 5500, unit: "crate (30 pcs)", stock: 80, rating: 4.7, image: img("photo-1582722872445-44dc5f7e3c8f"), description: "Farm-fresh eggs collected daily. Strong shells, deep yellow yolks.", tags: ["fresh"] },
  { id: "p6", name: "Sweet Potatoes", vendorId: "v1", categoryId: "tubers", price: 2800, unit: "10kg bag", stock: 35, rating: 4.6, image: img("photo-1596097635121-14b73c1b4e8e"), description: "Orange-flesh sweet potatoes, rich in vitamin A.", tags: ["nutritious"] },
  { id: "p7", name: "Scotch Bonnet Peppers", vendorId: "v1", categoryId: "spices", price: 1500, unit: "1kg", stock: 25, rating: 4.9, image: img("photo-1583119912267-cc97c911e416"), description: "Hot and aromatic scotch bonnets, perfect for jollof and stews.", tags: ["spicy"] },
  { id: "p8", name: "NPK Fertilizer", vendorId: "v3", categoryId: "inputs", price: 28000, originalPrice: 32000, unit: "50kg bag", stock: 50, rating: 4.5, image: img("photo-1625246333195-78d9c38ad449"), description: "Balanced NPK 15-15-15 fertilizer for all crops.", tags: ["agro-input"] },
  { id: "p9", name: "Fresh Spinach (Ugu)", vendorId: "v1", categoryId: "vegetables", price: 600, unit: "bunch", stock: 90, rating: 4.7, image: img("photo-1576045057995-568f588f82fb"), description: "Fresh fluted pumpkin leaves for vegetable soup.", tags: ["leafy", "fresh"] },
  { id: "p10", name: "Plantains", vendorId: "v4", categoryId: "fruits", price: 2500, unit: "bunch (10pcs)", stock: 22, rating: 4.6, image: img("photo-1603033156166-2ae22eb2b7e2"), description: "Ripe and unripe plantains available — your choice at delivery.", tags: ["staple"] },
  { id: "p11", name: "Raw Cow Milk", vendorId: "v5", categoryId: "dairy", price: 1800, unit: "liter", stock: 40, rating: 4.8, image: img("photo-1550583724-b2692b85b150"), description: "Fresh raw cow milk from grass-fed heritage breeds.", tags: ["grass-fed"] },
  { id: "p12", name: "Yellow Maize", vendorId: "v3", categoryId: "grains", price: 22000, originalPrice: 26000, unit: "100kg bag", stock: 30, rating: 4.7, image: img("photo-1601593768793-9e4b6d52c6bf"), description: "Properly dried yellow maize, ideal for poultry feed and pap.", tags: ["bulk"] },
];

export const findProduct = (id: string) => products.find((p) => p.id === id);
export const findVendor = (id: string) => vendors.find((v) => v.id === id);
export const productsByVendor = (vendorId: string) => products.filter((p) => p.vendorId === vendorId);
export const productsByCategory = (categoryId: string) => products.filter((p) => p.categoryId === categoryId);
