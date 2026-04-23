import { useEffect, useState, createContext, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type Role = "buyer" | "farmer" | "vendor";

export interface User {
  id: string;
  name: string;
  phone: string;
  location: string;
  role: Role;
  walletBalance: number;
  agPoints: number;
  trustScore: number;
  creditLimit: number;
  creditUsed: number;
  lifetimeSavings: number;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  image: string;
  description: string;
  farmGatePrice: number;
  marketPrice: number;
  qty: number;
  vendorId: string;
  rating: number;
  location: string;
}

export interface Vendor {
  id: string;
  name: string;
  avatar: string;
  verified: boolean;
  rating: number;
  totalSales: number;
  joinedAt: string;
  location: string;
}

export interface OrderItem {
  productId: string;
  qty: number;
  price: number;
}

export interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  savings: number;
  status: "processing" | "in_transit" | "delivered";
  deliveryAddress: string;
  paymentMethod: string;
  createdAt: string;
  agPointsEarned: number;
  vendorId: string;
}

export interface Transaction {
  id: string;
  type: "credit" | "debit" | "points";
  amount: number;
  label: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  type: "order" | "price" | "credit" | "promo";
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
}

interface AppState {
  hasOnboarded: boolean;
  user: User | null;
  products: Product[];
  vendors: Vendor[];
  orders: Order[];
  transactions: Transaction[];
  notifications: Notification[];
  cart: OrderItem[];
}

interface StoreContextType extends AppState {
  isHydrated: boolean;
  updateUser: (data: Partial<User>) => Promise<void>;
  setOnboarded: (val: boolean) => Promise<void>;
  addToCart: (item: OrderItem) => Promise<void>;
  updateCartQty: (productId: string, qty: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  placeOrder: (order: Order) => Promise<void>;
  updateOrderStatus: (id: string, status: Order["status"]) => Promise<void>;
  addTransaction: (tx: Transaction) => Promise<void>;
  markNotificationRead: (id: string) => Promise<void>;
  fundWallet: (amount: number) => Promise<void>;
  addProduct: (p: Product) => Promise<void>;
  resetAll: () => Promise<void>;
}

const defaultState: AppState = {
  hasOnboarded: false,
  user: null,
  products: [],
  vendors: [],
  orders: [],
  transactions: [],
  notifications: [],
  cart: [],
};

const StoreContext = createContext<StoreContextType | null>(null);

const STORAGE_KEY = "@agmart_state_v2";

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(defaultState);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          setState(JSON.parse(stored));
        } else {
          const seeded = seedData();
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
          setState(seeded);
        }
      } catch {
        setState(seedData());
      } finally {
        setIsHydrated(true);
      }
    }
    load();
  }, []);

  const saveState = async (newState: AppState) => {
    setState(newState);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
  };

  const updateUser = async (data: Partial<User>) => {
    if (!state.user) return;
    await saveState({ ...state, user: { ...state.user, ...data } });
  };

  const setOnboarded = async (val: boolean) => {
    await saveState({ ...state, hasOnboarded: val });
  };

  const addToCart = async (item: OrderItem) => {
    const newCart = [...state.cart];
    const existing = newCart.find((i) => i.productId === item.productId);
    if (existing) existing.qty += item.qty;
    else newCart.push(item);
    await saveState({ ...state, cart: newCart });
  };

  const updateCartQty = async (productId: string, qty: number) => {
    const newCart = state.cart
      .map((i) => (i.productId === productId ? { ...i, qty } : i))
      .filter((i) => i.qty > 0);
    await saveState({ ...state, cart: newCart });
  };

  const removeFromCart = async (productId: string) => {
    await saveState({
      ...state,
      cart: state.cart.filter((i) => i.productId !== productId),
    });
  };

  const clearCart = async () => {
    await saveState({ ...state, cart: [] });
  };

  const placeOrder = async (order: Order) => {
    if (!state.user) return;
    await saveState({
      ...state,
      orders: [order, ...state.orders],
      cart: [],
      user: {
        ...state.user,
        walletBalance: state.user.walletBalance - order.total,
        agPoints: state.user.agPoints + order.agPointsEarned,
        trustScore: Math.min(100, state.user.trustScore + 1),
        lifetimeSavings: state.user.lifetimeSavings + order.savings,
      },
      transactions: [
        {
          id: makeId(),
          type: "debit",
          amount: order.total,
          label: `Order #${order.id.slice(-5)}`,
          createdAt: new Date().toISOString(),
        },
        {
          id: makeId(),
          type: "points",
          amount: order.agPointsEarned,
          label: "Points earned",
          createdAt: new Date().toISOString(),
        },
        ...state.transactions,
      ],
    });
  };

  const updateOrderStatus = async (id: string, status: Order["status"]) => {
    await saveState({
      ...state,
      orders: state.orders.map((o) => (o.id === id ? { ...o, status } : o)),
    });
  };

  const addTransaction = async (tx: Transaction) => {
    await saveState({ ...state, transactions: [tx, ...state.transactions] });
  };

  const fundWallet = async (amount: number) => {
    if (!state.user) return;
    await saveState({
      ...state,
      user: { ...state.user, walletBalance: state.user.walletBalance + amount },
      transactions: [
        {
          id: makeId(),
          type: "credit",
          amount,
          label: "Wallet funding",
          createdAt: new Date().toISOString(),
        },
        ...state.transactions,
      ],
    });
  };

  const markNotificationRead = async (id: string) => {
    await saveState({
      ...state,
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n,
      ),
    });
  };

  const addProduct = async (p: Product) => {
    await saveState({ ...state, products: [p, ...state.products] });
  };

  const resetAll = async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    setState(defaultState);
  };

  return (
    <StoreContext.Provider
      value={{
        ...state,
        isHydrated,
        updateUser,
        setOnboarded,
        addToCart,
        updateCartQty,
        removeFromCart,
        clearCart,
        placeOrder,
        updateOrderStatus,
        addTransaction,
        markNotificationRead,
        fundWallet,
        addProduct,
        resetAll,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within StoreProvider");
  return context;
}

export function makeId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
}

function daysAgo(d: number) {
  const dt = new Date();
  dt.setDate(dt.getDate() - d);
  return dt.toISOString();
}

function seedData(): AppState {
  const user: User = {
    id: "u1",
    name: "",
    phone: "",
    location: "",
    role: "buyer",
    walletBalance: 25000,
    agPoints: 450,
    trustScore: 65,
    creditLimit: 50000,
    creditUsed: 12000,
    lifetimeSavings: 18400,
  };

  const vendors: Vendor[] = [
    { id: "v1", name: "Ibrahim Farms", avatar: "farmer.png", verified: true, rating: 4.8, totalSales: 1250, joinedAt: "2023-01-10T00:00:00Z", location: "Kano" },
    { id: "v2", name: "Ojo Seafoods", avatar: "farmer.png", verified: true, rating: 4.6, totalSales: 890, joinedAt: "2023-05-22T00:00:00Z", location: "Lagos" },
    { id: "v3", name: "Adeola Greenhouse", avatar: "farmer.png", verified: true, rating: 4.9, totalSales: 2030, joinedAt: "2022-09-14T00:00:00Z", location: "Oyo" },
    { id: "v4", name: "Bello Poultry", avatar: "farmer.png", verified: true, rating: 4.7, totalSales: 1640, joinedAt: "2023-03-18T00:00:00Z", location: "Ogun" },
    { id: "v5", name: "Chinedu AgriInputs", avatar: "farmer.png", verified: false, rating: 4.2, totalSales: 410, joinedAt: "2024-02-01T00:00:00Z", location: "Enugu" },
    { id: "v6", name: "Kaduna Grain Co.", avatar: "farmer.png", verified: true, rating: 4.5, totalSales: 980, joinedAt: "2023-08-05T00:00:00Z", location: "Kaduna" },
    { id: "v7", name: "Niger Delta Fisheries", avatar: "farmer.png", verified: true, rating: 4.4, totalSales: 720, joinedAt: "2023-11-12T00:00:00Z", location: "Rivers" },
    { id: "v8", name: "Plateau Fresh Picks", avatar: "farmer.png", verified: true, rating: 4.8, totalSales: 1350, joinedAt: "2023-06-30T00:00:00Z", location: "Plateau" },
  ];

  const products: Product[] = [
    { id: "p1", name: "Fresh Tomatoes (Basket)", category: "Crops", image: "tomatoes.png", description: "Freshly harvested plum tomatoes from the rich soils of Kano. Hand-picked at peak ripeness, ideal for stews and sauces.", farmGatePrice: 12000, marketPrice: 18000, qty: 50, vendorId: "v1", rating: 4.5, location: "Kano" },
    { id: "p2", name: "Yellow Maize (50kg)", category: "Crops", image: "maize.png", description: "Premium dried yellow maize, sun-dried and properly stored. Sold per 50kg sack.", farmGatePrice: 28000, marketPrice: 38000, qty: 80, vendorId: "v6", rating: 4.6, location: "Kaduna" },
    { id: "p3", name: "Leafy Greens Bundle", category: "Crops", image: "greens.png", description: "Mixed bundle of ugu, kale and spinach, harvested this morning.", farmGatePrice: 1500, marketPrice: 2500, qty: 120, vendorId: "v3", rating: 4.7, location: "Oyo" },
    { id: "p4", name: "Live Broiler Chicken", category: "Livestock", image: "poultry.png", description: "Healthy 8-week old broiler, raised free-range with natural feed.", farmGatePrice: 3500, marketPrice: 5000, qty: 100, vendorId: "v4", rating: 4.8, location: "Ogun" },
    { id: "p5", name: "Layer Hen (Mature)", category: "Livestock", image: "poultry.png", description: "Egg-laying mature hen, high yield breed.", farmGatePrice: 4200, marketPrice: 6000, qty: 60, vendorId: "v4", rating: 4.5, location: "Ogun" },
    { id: "p6", name: "Catfish (1kg)", category: "Fishery", image: "fish.png", description: "Freshly caught catfish, sold by the kilogram. Cleaned on request.", farmGatePrice: 1800, marketPrice: 2500, qty: 200, vendorId: "v2", rating: 4.2, location: "Lagos" },
    { id: "p7", name: "Tilapia (1kg)", category: "Fishery", image: "fish.png", description: "Whole tilapia harvested from clean pond water.", farmGatePrice: 2200, marketPrice: 3200, qty: 150, vendorId: "v7", rating: 4.4, location: "Rivers" },
    { id: "p8", name: "NPK Fertilizer (50kg)", category: "Farm Inputs", image: "inputs.png", description: "NPK 15-15-15 fertilizer, sealed bag from licensed distributor.", farmGatePrice: 22000, marketPrice: 32000, qty: 40, vendorId: "v5", rating: 4.3, location: "Enugu" },
    { id: "p9", name: "Hybrid Maize Seeds (5kg)", category: "Farm Inputs", image: "inputs.png", description: "High-yield drought-resistant hybrid maize seedlings.", farmGatePrice: 8000, marketPrice: 12000, qty: 30, vendorId: "v5", rating: 4.5, location: "Enugu" },
    { id: "p10", name: "Weekly Veggie Basket", category: "Bundles", image: "greens.png", description: "Curated weekly basket: tomatoes, peppers, onions, leafy greens, plantain. Feeds a family of 4.", farmGatePrice: 9500, marketPrice: 15000, qty: 25, vendorId: "v3", rating: 4.9, location: "Oyo" },
    { id: "p11", name: "Family Protein Bundle", category: "Bundles", image: "poultry.png", description: "1 broiler + 2kg catfish + 30 eggs. Weekly protein for a household.", farmGatePrice: 11500, marketPrice: 17000, qty: 20, vendorId: "v4", rating: 4.7, location: "Ogun" },
    { id: "p12", name: "Sweet Potatoes (10kg)", category: "Crops", image: "tomatoes.png", description: "Orange-fleshed sweet potatoes, vitamin-rich.", farmGatePrice: 6500, marketPrice: 9500, qty: 70, vendorId: "v8", rating: 4.6, location: "Plateau" },
    { id: "p13", name: "Yam Tubers (Per Tuber)", category: "Crops", image: "tomatoes.png", description: "Premium puna yam tubers from Plateau farms.", farmGatePrice: 3500, marketPrice: 5500, qty: 150, vendorId: "v8", rating: 4.4, location: "Plateau" },
    { id: "p14", name: "Goat (Mature)", category: "Livestock", image: "poultry.png", description: "Mature healthy goat, perfect for ceremonies or restocking.", farmGatePrice: 75000, marketPrice: 95000, qty: 8, vendorId: "v1", rating: 4.7, location: "Kano" },
    { id: "p15", name: "Smoked Fish (1kg)", category: "Fishery", image: "fish.png", description: "Traditionally smoked catfish, long shelf life.", farmGatePrice: 4500, marketPrice: 6500, qty: 60, vendorId: "v7", rating: 4.6, location: "Rivers" },
    { id: "p16", name: "Onions (Mudu)", category: "Crops", image: "tomatoes.png", description: "Fresh red onions, sold per mudu measure.", farmGatePrice: 2500, marketPrice: 3800, qty: 90, vendorId: "v6", rating: 4.3, location: "Kaduna" },
    { id: "p17", name: "Pepper Mix (Basket)", category: "Crops", image: "tomatoes.png", description: "Tatashe and rodo pepper mix, fresh from farm.", farmGatePrice: 7500, marketPrice: 11000, qty: 40, vendorId: "v1", rating: 4.5, location: "Kano" },
    { id: "p18", name: "Insecticide Spray (1L)", category: "Farm Inputs", image: "inputs.png", description: "Crop protection insecticide, NAFDAC approved.", farmGatePrice: 4800, marketPrice: 6800, qty: 50, vendorId: "v5", rating: 4.2, location: "Enugu" },
    { id: "p19", name: "Eggs (Crate of 30)", category: "Livestock", image: "poultry.png", description: "Farm-fresh eggs, packed today.", farmGatePrice: 3800, marketPrice: 5500, qty: 100, vendorId: "v4", rating: 4.8, location: "Ogun" },
    { id: "p20", name: "Monthly Family Plan", category: "Bundles", image: "greens.png", description: "4 weekly baskets delivered every Saturday for a month.", farmGatePrice: 36000, marketPrice: 56000, qty: 15, vendorId: "v3", rating: 4.9, location: "Oyo" },
  ];

  const orders: Order[] = [
    {
      id: "ord_001",
      items: [{ productId: "p1", qty: 1, price: 12000 }, { productId: "p3", qty: 2, price: 1500 }],
      total: 15500,
      savings: 6000,
      status: "delivered",
      deliveryAddress: "12 Allen Avenue, Ikeja, Lagos",
      paymentMethod: "Wallet",
      createdAt: daysAgo(15),
      agPointsEarned: 155,
      vendorId: "v1",
    },
    {
      id: "ord_002",
      items: [{ productId: "p4", qty: 2, price: 3500 }],
      total: 7500,
      savings: 3000,
      status: "delivered",
      deliveryAddress: "12 Allen Avenue, Ikeja, Lagos",
      paymentMethod: "Wallet",
      createdAt: daysAgo(7),
      agPointsEarned: 75,
      vendorId: "v4",
    },
    {
      id: "ord_003",
      items: [{ productId: "p10", qty: 1, price: 9500 }],
      total: 10000,
      savings: 5500,
      status: "in_transit",
      deliveryAddress: "12 Allen Avenue, Ikeja, Lagos",
      paymentMethod: "Wallet",
      createdAt: daysAgo(2),
      agPointsEarned: 100,
      vendorId: "v3",
    },
    {
      id: "ord_004",
      items: [{ productId: "p6", qty: 3, price: 1800 }],
      total: 5900,
      savings: 2100,
      status: "processing",
      deliveryAddress: "12 Allen Avenue, Ikeja, Lagos",
      paymentMethod: "Wallet",
      createdAt: daysAgo(0),
      agPointsEarned: 59,
      vendorId: "v2",
    },
  ];

  const transactions: Transaction[] = [
    { id: "t1", type: "credit", amount: 50000, label: "Wallet funding", createdAt: daysAgo(20) },
    { id: "t2", type: "debit", amount: 15500, label: "Order #ord_001", createdAt: daysAgo(15) },
    { id: "t3", type: "points", amount: 155, label: "Points earned", createdAt: daysAgo(15) },
    { id: "t4", type: "debit", amount: 7500, label: "Order #ord_002", createdAt: daysAgo(7) },
    { id: "t5", type: "points", amount: 75, label: "Points earned", createdAt: daysAgo(7) },
    { id: "t6", type: "credit", amount: 10000, label: "Wallet funding", createdAt: daysAgo(5) },
    { id: "t7", type: "debit", amount: 10000, label: "Order #ord_003", createdAt: daysAgo(2) },
    { id: "t8", type: "points", amount: 100, label: "Points earned", createdAt: daysAgo(2) },
    { id: "t9", type: "debit", amount: 5900, label: "Order #ord_004", createdAt: daysAgo(0) },
    { id: "t10", type: "points", amount: 59, label: "Points earned", createdAt: daysAgo(0) },
  ];

  const notifications: Notification[] = [
    { id: "n1", type: "order", title: "Order in transit", body: "Your order #ord_003 is on the way.", read: false, createdAt: daysAgo(1) },
    { id: "n2", type: "price", title: "Price drop", body: "Tomatoes dropped by ₦2,000. Stock up now.", read: false, createdAt: daysAgo(2) },
    { id: "n3", type: "credit", title: "Credit unlocked", body: "You qualify for ₦50,000 in AG Credit.", read: false, createdAt: daysAgo(3) },
    { id: "n4", type: "promo", title: "Weekend bundle", body: "20% off all family bundles this weekend.", read: true, createdAt: daysAgo(4) },
    { id: "n5", type: "order", title: "Order delivered", body: "Order #ord_002 was delivered successfully.", read: true, createdAt: daysAgo(7) },
    { id: "n6", type: "price", title: "Maize back in stock", body: "Yellow maize 50kg is back from Kaduna Grain Co.", read: true, createdAt: daysAgo(10) },
  ];

  return {
    hasOnboarded: false,
    user,
    products,
    vendors,
    orders,
    transactions,
    notifications,
    cart: [],
  };
}
