import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { findProduct, type Product } from "@/data/catalog";

export type CartItem = { productId: string; quantity: number };

export type Order = {
  id: string;
  items: CartItem[];
  total: number;
  createdAt: string;
  status: "Pending" | "Confirmed" | "In Transit" | "Delivered";
  address: string;
};

type CartContextValue = {
  items: CartItem[];
  orders: Order[];
  add: (productId: string, qty?: number) => void;
  remove: (productId: string) => void;
  setQty: (productId: string, qty: number) => void;
  clear: () => void;
  totalCount: number;
  subtotal: number;
  placeOrder: (address: string) => Order;
  detailedItems: { product: Product; quantity: number; lineTotal: number }[];
};

const CartContext = createContext<CartContextValue | null>(null);

const LS_CART = "ag-mart:cart";
const LS_ORDERS = "ag-mart:orders";

function loadJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => loadJSON<CartItem[]>(LS_CART, []));
  const [orders, setOrders] = useState<Order[]>(() => loadJSON<Order[]>(LS_ORDERS, []));

  useEffect(() => {
    localStorage.setItem(LS_CART, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem(LS_ORDERS, JSON.stringify(orders));
  }, [orders]);

  const value: CartContextValue = useMemo(() => {
    const detailedItems = items
      .map((it) => {
        const product = findProduct(it.productId);
        if (!product) return null;
        return { product, quantity: it.quantity, lineTotal: product.price * it.quantity };
      })
      .filter((x): x is { product: Product; quantity: number; lineTotal: number } => x !== null);

    const subtotal = detailedItems.reduce((sum, x) => sum + x.lineTotal, 0);
    const totalCount = items.reduce((sum, x) => sum + x.quantity, 0);

    return {
      items,
      orders,
      detailedItems,
      subtotal,
      totalCount,
      add: (productId, qty = 1) =>
        setItems((cur) => {
          const existing = cur.find((c) => c.productId === productId);
          if (existing) {
            return cur.map((c) =>
              c.productId === productId ? { ...c, quantity: c.quantity + qty } : c
            );
          }
          return [...cur, { productId, quantity: qty }];
        }),
      remove: (productId) => setItems((cur) => cur.filter((c) => c.productId !== productId)),
      setQty: (productId, qty) =>
        setItems((cur) =>
          qty <= 0
            ? cur.filter((c) => c.productId !== productId)
            : cur.map((c) => (c.productId === productId ? { ...c, quantity: qty } : c))
        ),
      clear: () => setItems([]),
      placeOrder: (address) => {
        const order: Order = {
          id: `ORD-${Date.now().toString(36).toUpperCase()}`,
          items: [...items],
          total: subtotal + 1500,
          createdAt: new Date().toISOString(),
          status: "Confirmed",
          address,
        };
        setOrders((cur) => [order, ...cur]);
        setItems([]);
        return order;
      },
    };
  }, [items, orders]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

export const formatNaira = (n: number) =>
  "₦" + n.toLocaleString("en-NG", { maximumFractionDigits: 0 });
