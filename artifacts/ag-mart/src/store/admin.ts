import { useEffect, useState } from "react";

export type QueueType = "signup" | "listing" | "message";
export type Status = "pending" | "approved" | "rejected";

export type AdminItem = {
  id: string;
  type: QueueType;
  status: Status;
  createdAt: number;
  reviewedAt?: number;
  title: string;
  subtitle?: string;
  data: Record<string, string | number | boolean | undefined>;
};

const STORAGE_KEY = "agrillion.admin.queue.v1";
const EVENT = "agrillion:admin-queue-change";

function read(): AdminItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return seed();
    const parsed = JSON.parse(raw) as AdminItem[];
    return Array.isArray(parsed) ? parsed : seed();
  } catch {
    return seed();
  }
}

function write(items: AdminItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event(EVENT));
}

function uid() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function seed(): AdminItem[] {
  const now = Date.now();
  const items: AdminItem[] = [
    {
      id: uid(),
      type: "signup",
      status: "pending",
      createdAt: now - 1000 * 60 * 35,
      title: "Aisha Bello",
      subtitle: "Farmer · Kano",
      data: {
        role: "farmer",
        email: "aisha.bello@example.com",
        phone: "+234 801 234 5678",
        state: "Kano",
        farmSize: "Big farm (> 5 hectares)",
        crop: "Maize",
      },
    },
    {
      id: uid(),
      type: "listing",
      status: "pending",
      createdAt: now - 1000 * 60 * 12,
      title: "Premium yellow maize · 50kg bag",
      subtitle: "Bello Foods Ltd · Ibadan, Oyo",
      data: {
        category: "Grains",
        unit: "50kg bag",
        state: "Oyo",
        location: "Bodija, Ibadan",
        quantity: 200,
        listPrice: 22000,
        logisticsFee: 3500,
      },
    },
    {
      id: uid(),
      type: "message",
      status: "pending",
      createdAt: now - 1000 * 60 * 4,
      title: "Logistics partnership enquiry",
      subtitle: "ColdChain NG · Lagos",
      data: {
        topic: "Logistics partnership",
        name: "Ifeanyi Eze",
        email: "ife@coldchain.ng",
        message:
          "We run 14 reefer vans across Lagos and Ogun and would like to plug into Agrillion's matching engine.",
      },
    },
  ];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  return items;
}

export const adminQueue = {
  add(input: Omit<AdminItem, "id" | "status" | "createdAt">) {
    const items = read();
    items.unshift({
      ...input,
      id: uid(),
      status: "pending",
      createdAt: Date.now(),
    });
    write(items);
  },
  setStatus(id: string, status: Status) {
    const items = read().map((it) =>
      it.id === id ? { ...it, status, reviewedAt: Date.now() } : it,
    );
    write(items);
  },
  remove(id: string) {
    write(read().filter((it) => it.id !== id));
  },
  clearReviewed() {
    write(read().filter((it) => it.status === "pending"));
  },
};

export function useAdminQueue() {
  const [items, setItems] = useState<AdminItem[]>(() => read());
  useEffect(() => {
    const handler = () => setItems(read());
    window.addEventListener(EVENT, handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener(EVENT, handler);
      window.removeEventListener("storage", handler);
    };
  }, []);
  return items;
}
