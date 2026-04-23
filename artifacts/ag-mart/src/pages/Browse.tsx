import { useMemo, useState, useEffect } from "react";
import { useLocation } from "wouter";
import { categories, products } from "@/data/catalog";
import { ProductCard } from "@/components/ProductCard";
import { Search } from "lucide-react";

function useQuery() {
  const [location] = useLocation();
  return useMemo(() => {
    const idx = location.indexOf("?");
    return new URLSearchParams(idx >= 0 ? location.slice(idx) : "");
  }, [location]);
}

export default function Browse() {
  const params = useQuery();
  const initialCat = params.get("category") ?? "all";
  const initialQ = params.get("q") ?? "";

  const [activeCat, setActiveCat] = useState(initialCat);
  const [q, setQ] = useState(initialQ);

  useEffect(() => {
    setActiveCat(initialCat);
    setQ(initialQ);
  }, [initialCat, initialQ]);

  const filtered = useMemo(() => {
    const ql = q.trim().toLowerCase();
    return products.filter((p) => {
      if (activeCat !== "all" && p.categoryId !== activeCat) return false;
      if (ql && !`${p.name} ${p.description} ${p.tags?.join(" ") ?? ""}`.toLowerCase().includes(ql))
        return false;
      return true;
    });
  }, [activeCat, q]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold">Browse the Marketplace</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {filtered.length} {filtered.length === 1 ? "product" : "products"} available
          </p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search produce, vendors, tags…"
            className="w-full h-11 pl-10 pr-4 rounded-full border bg-card focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
          <button
            onClick={() => setActiveCat("all")}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition ${
              activeCat === "all"
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card hover:bg-muted"
            }`}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCat(c.id)}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition flex items-center gap-2 ${
                activeCat === c.id
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card hover:bg-muted"
              }`}
            >
              <span>{c.emoji}</span>
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-16 text-center py-16 border-2 border-dashed rounded-2xl">
          <div className="text-5xl mb-3">🔍</div>
          <div className="font-semibold">No products match your search</div>
          <p className="text-sm text-muted-foreground mt-1">Try a different category or term.</p>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
