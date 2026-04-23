import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ScanLine, Bot, Send, Sparkles, Activity, AlertTriangle, CheckCircle2,
  Image as ImageIcon, Cpu, Boxes, ClipboardCheck, RefreshCw, TrendingUp,
} from "lucide-react";
import { AnimatedIcon } from "@/components/AnimatedIcon";

type Msg = { role: "user" | "ai"; text: string };

const seedReplies: Record<string, string> = {
  default:
    "I can run quality checks on your batches, update inventory, and surface low-stock alerts. What would you like to do?",
  qc: "Last batch (Yellow Maize · 50 bags) scored 96/100. Two bags flagged for moisture > 14% — I've held them from the live marketplace.",
  stock: "Inventory updated. Tomato (basket): 38 → 32. Eggs (crate): 120 → 118. Yellow Maize (50kg): 50 → 47. Snapshot saved at 14:02.",
  low: "3 SKUs are below reorder point: Pepper · Scotch Bonnet (3 kg left), Plantain bunches (5 left), Raw Milk (8L left). Want me to draft restock orders?",
  price: "AI Mart suggests raising your Tomato list price by 4% — regional supply has tightened in the last 36 hours.",
};

function aiReply(q: string): string {
  const k = q.toLowerCase();
  if (k.includes("quality") || k.includes("qc") || k.includes("scan")) return seedReplies.qc;
  if (k.includes("stock") || k.includes("inventory") || k.includes("update")) return seedReplies.stock;
  if (k.includes("low") || k.includes("restock") || k.includes("reorder")) return seedReplies.low;
  if (k.includes("price") || k.includes("market")) return seedReplies.price;
  return seedReplies.default;
}

const samplePrompts = [
  "Run a QC report on my last batch",
  "Update tonight's inventory snapshot",
  "Which SKUs are low on stock?",
  "Should I raise tomato prices?",
];

const inventory = [
  { sku: "MAIZE-50KG", name: "Yellow Maize", unit: "50kg bag", stock: 47, reorder: 20, qc: 96 },
  { sku: "TOM-BSK", name: "Tomato", unit: "basket", stock: 32, reorder: 25, qc: 91 },
  { sku: "EGG-CRT", name: "Crate of Eggs", unit: "crate", stock: 118, reorder: 60, qc: 98 },
  { sku: "PEP-KG", name: "Scotch Bonnet", unit: "kg", stock: 3, reorder: 10, qc: 88 },
  { sku: "PLN-BCH", name: "Plantain", unit: "bunch", stock: 5, reorder: 15, qc: 93 },
  { sku: "MLK-L", name: "Raw Milk", unit: "litre", stock: 8, reorder: 20, qc: 95 },
];

const activity = [
  { t: "QC pass · Maize batch #2841", loc: "auto · 2 min ago", level: "ok" },
  { t: "Restock alert · Scotch Bonnet (3kg)", loc: "auto · 14 min ago", level: "warn" },
  { t: "Inventory snapshot saved", loc: "auto · 32 min ago", level: "ok" },
  { t: "QC hold · Maize · 2 bags moisture > 14%", loc: "auto · 1 hr ago", level: "warn" },
  { t: "Smart pricing applied to 12 SKUs", loc: "auto · 2 hr ago", level: "ok" },
];

export default function AIMart() {
  const [messages, setMessages] = useState<Msg[]>([
    { role: "ai", text: "Hi 👋 I'm AI Mart — your quality control and inventory assistant. Ask me to run a QC, update stock, or flag what needs reordering." },
  ]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);

  const summary = useMemo(() => {
    const totalSku = inventory.length;
    const lowStock = inventory.filter((i) => i.stock < i.reorder).length;
    const avgQc = Math.round(inventory.reduce((a, b) => a + b.qc, 0) / inventory.length);
    const totalUnits = inventory.reduce((a, b) => a + b.stock, 0);
    return { totalSku, lowStock, avgQc, totalUnits };
  }, []);

  const send = (text: string) => {
    if (!text.trim()) return;
    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");
    setThinking(true);
    setTimeout(() => {
      setMessages((m) => [...m, { role: "ai", text: aiReply(text) }]);
      setThinking(false);
    }, 700);
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/40">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-primary/15 blur-3xl animate-float" />
        <div className="absolute top-10 right-0 h-72 w-72 rounded-full bg-accent/15 blur-3xl animate-float" style={{ animationDelay: "3s" }} />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border/60 bg-card/30 text-xs font-medium mb-5 text-muted-foreground">
              <Cpu className="h-3.5 w-3.5 text-accent" /> AI Mart · Live for your account
            </div>
            <h1 className="font-serif text-4xl sm:text-6xl font-semibold leading-tight tracking-tight">
              <span className="text-foreground/90">Quality scored.</span>
              <br />
              <span className="neon-text">Inventory always current.</span>
            </h1>
            <p className="mt-5 text-lg text-foreground/65 max-w-xl leading-relaxed">
              AI Mart runs quality control on every batch and keeps your inventory updated
              in real time — per user, per SKU. No spreadsheets, no surprises.
            </p>
          </div>
        </div>
      </section>

      {/* Personal summary cards */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { Icon: Boxes, label: "SKUs tracked", value: summary.totalSku, accent: "primary" as const },
          { Icon: ClipboardCheck, label: "Avg QC score", value: `${summary.avgQc}/100`, accent: "accent" as const },
          { Icon: AlertTriangle, label: "Low-stock alerts", value: summary.lowStock, accent: "secondary" as const },
          { Icon: TrendingUp, label: "Units in stock", value: summary.totalUnits, accent: "primary" as const },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="rounded-2xl border border-border/50 bg-card/30 p-5"
          >
            <div className="flex items-center gap-3">
              <AnimatedIcon Icon={s.Icon} accent={s.accent} size={42} />
              <div>
                <div className="font-serif text-2xl font-semibold neon-text">{s.value}</div>
                <div className="text-[10px] uppercase tracking-wider font-mono text-muted-foreground mt-0.5">
                  {s.label}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-2 grid lg:grid-cols-3 gap-6">
        {/* Copilot */}
        <div className="lg:col-span-2 rounded-3xl border border-border/50 bg-card/30 p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <AnimatedIcon Icon={Bot} accent="primary" size={44} />
              <div>
                <div className="font-serif font-semibold text-lg">AI Mart Copilot</div>
                <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                  Online · model agrillion-1.4
                </div>
              </div>
            </div>
            <div className="text-[10px] uppercase tracking-wider font-mono text-muted-foreground hidden sm:block">
              /chat
            </div>
          </div>

          <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
            {messages.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${m.role === "user" ? "justify-end" : ""}`}
              >
                {m.role === "ai" && (
                  <div className="h-8 w-8 rounded-full neon-bg flex items-center justify-center shrink-0">
                    <Sparkles className="h-4 w-4 text-primary-foreground" />
                  </div>
                )}
                <div
                  className={`rounded-2xl px-4 py-2.5 text-sm max-w-[80%] ${
                    m.role === "ai"
                      ? "border border-border/60 bg-background/40"
                      : "bg-primary text-primary-foreground"
                  }`}
                >
                  {m.text}
                </div>
              </motion.div>
            ))}
            {thinking && (
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-full neon-bg flex items-center justify-center shrink-0">
                  <Sparkles className="h-4 w-4 text-primary-foreground" />
                </div>
                <div className="border border-border/60 bg-background/40 rounded-2xl px-4 py-3 inline-flex gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="h-2 w-2 rounded-full bg-primary animate-blink"
                      style={{ animationDelay: `${i * 0.18}s` }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-5">
            <div className="flex flex-wrap gap-2 mb-3">
              {samplePrompts.map((p) => (
                <button
                  key={p}
                  onClick={() => send(p)}
                  className="text-xs px-3 py-1.5 rounded-full border border-border/60 bg-background/40 hover:border-primary/50 transition"
                >
                  {p}
                </button>
              ))}
            </div>
            <form
              onSubmit={(e) => { e.preventDefault(); send(input); }}
              className="flex gap-2"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask AI Mart…"
                className="flex-1 h-12 px-4 rounded-full bg-background/40 border border-border/60 focus:border-primary/50 focus:outline-none text-sm"
              />
              <button
                type="submit"
                className="h-12 w-12 rounded-full neon-bg text-primary-foreground flex items-center justify-center glow-primary shrink-0"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-border/50 bg-card/30 p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="font-serif font-semibold text-lg flex items-center gap-2">
                <Activity className="h-5 w-5 text-accent" /> Activity
              </div>
              <span className="text-[10px] uppercase font-mono text-muted-foreground">/feed</span>
            </div>
            <div className="space-y-3">
              {activity.map((a, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="flex gap-3"
                >
                  <div
                    className={`mt-1 h-2 w-2 rounded-full shrink-0 ${
                      a.level === "warn" ? "bg-secondary" : "bg-primary"
                    } animate-pulse`}
                  />
                  <div>
                    <div className="text-sm font-medium leading-tight">{a.t}</div>
                    <div className="text-xs text-muted-foreground mt-0.5 font-mono">{a.loc}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-border/50 bg-card/30 p-5">
            <div className="flex items-center gap-3 mb-4">
              <AnimatedIcon Icon={ScanLine} accent="primary" size={40} />
              <div>
                <div className="font-serif font-semibold">QC Scan</div>
                <div className="text-xs text-muted-foreground">Upload a batch photo</div>
              </div>
            </div>
            <div className="rounded-2xl border-2 border-dashed border-border/70 p-6 text-center hover:border-primary/50 transition cursor-pointer relative overflow-hidden">
              <div className="absolute inset-x-0 h-12 bg-gradient-to-b from-transparent via-primary/20 to-transparent animate-scan" />
              <ImageIcon className="mx-auto h-8 w-8 text-muted-foreground" />
              <div className="mt-2 text-sm font-medium">Drop a batch photo</div>
              <div className="text-xs text-muted-foreground">JPG, PNG · up to 10MB</div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-xl border border-border/60 bg-background/40 p-3 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span>Defect detection</span>
              </div>
              <div className="rounded-xl border border-border/60 bg-background/40 p-3 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-secondary" />
                <span>Severity scoring</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Inventory table */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="rounded-3xl border border-border/50 bg-card/30 p-5 sm:p-6">
          <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <AnimatedIcon Icon={Boxes} accent="accent" size={44} />
              <div>
                <div className="font-serif text-lg font-semibold">Your inventory</div>
                <div className="text-xs text-muted-foreground font-mono">/inventory · live</div>
              </div>
            </div>
            <button className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border/60 text-sm hover:border-primary/50">
              <RefreshCw className="h-3.5 w-3.5" /> Sync now
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider font-mono text-muted-foreground border-b border-border/50">
                  <th className="py-3 pr-3">SKU</th>
                  <th className="py-3 pr-3">Product</th>
                  <th className="py-3 pr-3">Unit</th>
                  <th className="py-3 pr-3 text-right">Stock</th>
                  <th className="py-3 pr-3 text-right">Reorder</th>
                  <th className="py-3 pr-3 text-right">QC</th>
                  <th className="py-3 pr-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map((it) => {
                  const low = it.stock < it.reorder;
                  return (
                    <tr key={it.sku} className="border-b border-border/30 last:border-none">
                      <td className="py-3 pr-3 font-mono text-xs">{it.sku}</td>
                      <td className="py-3 pr-3 font-medium">{it.name}</td>
                      <td className="py-3 pr-3 text-muted-foreground">{it.unit}</td>
                      <td className="py-3 pr-3 text-right font-semibold">{it.stock}</td>
                      <td className="py-3 pr-3 text-right text-muted-foreground">{it.reorder}</td>
                      <td className="py-3 pr-3 text-right">
                        <span
                          className={`font-mono ${
                            it.qc >= 95 ? "text-primary" : it.qc >= 90 ? "text-accent" : "text-secondary"
                          }`}
                        >
                          {it.qc}
                        </span>
                      </td>
                      <td className="py-3 pr-3">
                        <span
                          className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
                            low
                              ? "border border-secondary/40 text-secondary bg-secondary/10"
                              : "border border-primary/40 text-primary bg-primary/10"
                          }`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${low ? "bg-secondary" : "bg-primary"} animate-pulse`} />
                          {low ? "Restock soon" : "In stock"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
