import { useState } from "react";
import { motion } from "framer-motion";
import {
  ScanLine,
  LineChart as LineChartIcon,
  Bot,
  CloudSun,
  Wallet,
  Globe2,
  Send,
  Sparkles,
  Leaf,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Image as ImageIcon,
  Cpu,
} from "lucide-react";
import { AnimatedIcon } from "@/components/AnimatedIcon";

type Msg = { role: "user" | "ai"; text: string };

const seedReplies: Record<string, string> = {
  default:
    "I can help with planting calendars, pest control, market timing, and connecting you to verified vendors. What would you like to focus on today?",
  pest: "For early tomato blight, apply a copper-based fungicide every 7–10 days and remove affected lower leaves. I'm also seeing 3 verified vendors near you with neem-based organic alternatives in stock.",
  price: "Yellow maize is currently averaging ₦22,000/100kg, down 4.2% week-on-week. My forecast suggests prices will rebound 6–9% over the next 14 days as demand from poultry farms peaks.",
  plant: "Based on your region's soil moisture and the 14-day forecast, the next ideal planting window for sorghum opens in 8 days and lasts ~12 days. I can prepare a planting checklist if you'd like.",
  weather: "Expect 4 days of light rainfall followed by a dry spell. Soil moisture in your area is currently 38% — adequate for transplanting most leafy vegetables.",
};

function aiReply(q: string): string {
  const k = q.toLowerCase();
  if (k.includes("pest") || k.includes("disease") || k.includes("blight")) return seedReplies.pest;
  if (k.includes("price") || k.includes("market") || k.includes("sell")) return seedReplies.price;
  if (k.includes("plant") || k.includes("sow") || k.includes("when")) return seedReplies.plant;
  if (k.includes("weather") || k.includes("rain") || k.includes("forecast")) return seedReplies.weather;
  return seedReplies.default;
}

const samplePrompts = [
  "When should I plant sorghum?",
  "What's the price forecast for maize?",
  "How do I treat tomato blight?",
  "Will it rain this week in my area?",
];

const modules = [
  {
    icon: ScanLine,
    accent: "primary" as const,
    t: "Crop Disease Vision",
    s: "Upload a leaf or fruit photo. Our trained model returns the most likely pathogen, severity, and treatment plan in seconds.",
    metric: "94.2%",
    metricLabel: "model accuracy",
  },
  {
    icon: LineChartIcon,
    accent: "accent" as const,
    t: "Yield Forecast Engine",
    s: "Combines satellite NDVI, soil moisture, and 5-year regional yield data to project harvest 8 weeks ahead.",
    metric: "8 wks",
    metricLabel: "forecast horizon",
  },
  {
    icon: CloudSun,
    accent: "secondary" as const,
    t: "Weather Telemetry",
    s: "Hyperlocal 14-day forecasts plus drought, frost, and storm alerts piped from satellite and field sensors.",
    metric: "14d",
    metricLabel: "rolling outlook",
  },
  {
    icon: Wallet,
    accent: "primary" as const,
    t: "Smart Pricing",
    s: "Recommends list prices based on real-time regional supply, demand signals, and seasonal patterns.",
    metric: "+12%",
    metricLabel: "avg vendor uplift",
  },
  {
    icon: Globe2,
    accent: "accent" as const,
    t: "Traceable Supply",
    s: "Every order tagged with origin, harvest date, and chain-of-custody — buyer-verifiable end to end.",
    metric: "100%",
    metricLabel: "tracked orders",
  },
  {
    icon: Bot,
    accent: "secondary" as const,
    t: "Farm Copilot",
    s: "Plain-language assistant for planting calendars, pest control, market timing, and supply matching.",
    metric: "24/7",
    metricLabel: "always-on",
  },
];

const activity = [
  { t: "New disease detected — Cassava Mosaic", loc: "Oyo · 2 min ago", level: "warn" },
  { t: "Maize price forecast updated +6.4%", loc: "Kano · 14 min ago", level: "ok" },
  { t: "47 farmers joined Agrillion network", loc: "Nationwide · 1 hr ago", level: "ok" },
  { t: "Drought alert issued for Borno State", loc: "Borno · 2 hr ago", level: "warn" },
  { t: "Smart pricing optimized for 380 vendors", loc: "Auto-run · 3 hr ago", level: "ok" },
];

export default function AILab() {
  const [messages, setMessages] = useState<Msg[]>([
    { role: "ai", text: "Hi 👋 I'm the Agrillion Farm Copilot. Ask me about planting, pests, prices, or weather — anything farm." },
  ]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);

  const send = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Msg = { role: "user", text };
    setMessages((m) => [...m, userMsg]);
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
      <section className="relative overflow-hidden border-b border-border/50">
        <div className="absolute inset-0 grid-bg opacity-50" />
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-primary/20 blur-3xl animate-float" />
        <div className="absolute top-10 right-0 h-72 w-72 rounded-full bg-accent/20 blur-3xl animate-float" style={{ animationDelay: "3s" }} />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs font-medium mb-5">
              <Cpu className="h-3.5 w-3.5 text-accent" /> AI Lab · Live
            </div>
            <h1 className="font-serif text-4xl sm:text-6xl font-bold leading-tight">
              Six AI modules.
              <br />
              <span className="neon-text">One smarter farm.</span>
            </h1>
            <p className="mt-5 text-lg text-muted-foreground max-w-xl">
              From vision-based disease detection to dynamic pricing, every Agrillion module
              is live, learning, and tuned for the realities of African agriculture.
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 grid lg:grid-cols-3 gap-6">
        {/* LEFT: Copilot chat */}
        <div className="lg:col-span-2 glass-strong rounded-3xl p-1 relative overflow-hidden">
          <div className="absolute inset-0 grid-bg opacity-20" />
          <div className="relative bg-card/40 rounded-[1.4rem] p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <AnimatedIcon Icon={Bot} accent="primary" size={44} />
                <div>
                  <div className="font-serif font-bold text-lg">Farm Copilot</div>
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

            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
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
                        ? "glass border-primary/20"
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
                  <div className="glass rounded-2xl px-4 py-3 inline-flex gap-1.5">
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
                    className="text-xs px-3 py-1.5 rounded-full glass hover:border-primary/50 transition"
                  >
                    {p}
                  </button>
                ))}
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  send(input);
                }}
                className="flex gap-2"
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask the Copilot…"
                  className="flex-1 h-12 px-4 rounded-full bg-muted/50 border border-border focus:border-primary/50 focus:outline-none text-sm"
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
        </div>

        {/* RIGHT: Live activity */}
        <div className="space-y-6">
          <div className="glass-strong rounded-3xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="font-serif font-bold text-lg flex items-center gap-2">
                <Activity className="h-5 w-5 text-accent" /> Live Network
              </div>
              <span className="text-[10px] uppercase font-mono text-muted-foreground">/feed</span>
            </div>
            <div className="space-y-3">
              {activity.map((a, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
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

          {/* Vision uploader (mock) */}
          <div className="glass-strong rounded-3xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <AnimatedIcon Icon={ScanLine} accent="primary" size={40} />
              <div>
                <div className="font-serif font-bold">Disease Vision</div>
                <div className="text-xs text-muted-foreground">Upload a leaf to scan</div>
              </div>
            </div>
            <div className="rounded-2xl border-2 border-dashed border-border/80 p-6 text-center hover:border-primary/50 transition cursor-pointer relative overflow-hidden">
              <div className="absolute inset-x-0 h-12 bg-gradient-to-b from-transparent via-primary/20 to-transparent animate-scan" />
              <ImageIcon className="mx-auto h-8 w-8 text-muted-foreground" />
              <div className="mt-2 text-sm font-medium">Drop a crop photo</div>
              <div className="text-xs text-muted-foreground">JPG, PNG · up to 10MB</div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div className="glass rounded-xl p-3 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span>200+ pathogens</span>
              </div>
              <div className="glass rounded-xl p-3 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-secondary" />
                <span>Severity scoring</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modules grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs font-medium mb-3">
            <Leaf className="h-3.5 w-3.5 text-primary" /> Module library
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold">
            Plug-in <span className="neon-text">intelligence</span>
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {modules.map((m, i) => (
            <motion.div
              key={m.t}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="group glass rounded-2xl p-6 hover:border-primary/40 transition relative overflow-hidden"
            >
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/5 group-hover:bg-primary/10 transition blur-2xl" />
              <div className="relative">
                <div className="flex items-start justify-between">
                  <AnimatedIcon Icon={m.icon} accent={m.accent} size={48} />
                  <div className="text-right">
                    <div className="font-serif font-bold text-2xl neon-text">{m.metric}</div>
                    <div className="text-[10px] uppercase font-mono text-muted-foreground tracking-wider">
                      {m.metricLabel}
                    </div>
                  </div>
                </div>
                <h3 className="mt-5 font-serif text-lg font-bold">{m.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{m.s}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
