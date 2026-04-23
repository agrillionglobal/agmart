import { useMemo } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

const items = [
  { sym: "TOMATO", name: "Tomato", price: "₦1,200/bk", change: -8.4 },
  { sym: "RICE", name: "Local Rice", price: "₦38,000/50kg", change: +2.1 },
  { sym: "MAIZE", name: "Yellow Maize", price: "₦22,000/100kg", change: -4.2 },
  { sym: "POULTRY", name: "Live Broiler", price: "₦6,500/bird", change: +1.6 },
  { sym: "EGGS", name: "Crate of Eggs", price: "₦4,800/crate", change: -3.0 },
  { sym: "PEPPER", name: "Scotch Bonnet", price: "₦1,500/kg", change: +12.5 },
  { sym: "MILK", name: "Raw Milk", price: "₦1,800/L", change: 0.0 },
  { sym: "PLANTAIN", name: "Plantain", price: "₦2,500/bunch", change: +5.4 },
  { sym: "NPK", name: "NPK Fertilizer", price: "₦28,000/50kg", change: -1.2 },
  { sym: "SP-POTATO", name: "Sweet Potato", price: "₦2,800/10kg", change: +3.8 },
];

export function PriceTicker() {
  const list = useMemo(() => [...items, ...items], []);
  return (
    <div className="relative border-y border-border/60 bg-card/40 overflow-hidden">
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10" />
      <div className="absolute left-3 top-1/2 -translate-y-1/2 z-20 flex items-center gap-2 glass rounded-full px-3 py-1">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-75 animate-ping" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
        </span>
        <span className="text-[10px] uppercase tracking-wider font-mono font-semibold">Live</span>
      </div>
      <div className="flex gap-8 py-3 animate-ticker whitespace-nowrap pl-28">
        {list.map((it, i) => {
          const up = it.change > 0;
          const flat = it.change === 0;
          return (
            <div key={i} className="inline-flex items-center gap-3 text-sm">
              <span className="font-mono text-xs text-muted-foreground">{it.sym}</span>
              <span className="font-semibold">{it.price}</span>
              <span
                className={`inline-flex items-center gap-1 text-xs font-medium ${
                  flat
                    ? "text-muted-foreground"
                    : up
                    ? "text-primary"
                    : "text-destructive"
                }`}
              >
                {!flat && (up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />)}
                {up ? "+" : ""}
                {it.change.toFixed(1)}%
              </span>
              <span className="text-muted-foreground">·</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
