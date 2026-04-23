import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  Sparkles,
  Leaf,
  Brain,
  Cpu,
  CloudSun,
  ScanLine,
  LineChart,
  Bot,
  Wallet,
  Globe2,
  Zap,
} from "lucide-react";
import { categories, products, vendors } from "@/data/catalog";
import { ProductCard } from "@/components/ProductCard";
import { HeroSlider } from "@/components/HeroSlider";
import { PriceTicker } from "@/components/PriceTicker";
import { AnimatedIcon } from "@/components/AnimatedIcon";
import { Counter } from "@/components/Counter";

export default function Home() {
  const featured = products.filter((p) => p.originalPrice).slice(0, 4);
  const trending = products.slice(0, 8);

  return (
    <div>
      <HeroSlider />
      <PriceTicker />

      {/* Trust strip */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: ShieldCheck, t: "Escrow Protected", s: "Funds held until delivery" },
          { icon: Truck, t: "Nationwide Delivery", s: "120+ cities covered" },
          { icon: Brain, t: "AI Verified", s: "Quality scored by vision AI" },
          { icon: Sparkles, t: "AG Points", s: "Earn rewards on every order" },
        ].map((f, i) => (
          <motion.div
            key={f.t}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="glass rounded-2xl p-4 flex items-center gap-3"
          >
            <AnimatedIcon Icon={f.icon} accent={i % 2 === 0 ? "primary" : "accent"} size={44} />
            <div>
              <div className="text-sm font-semibold">{f.t}</div>
              <div className="text-xs text-muted-foreground">{f.s}</div>
            </div>
          </motion.div>
        ))}
      </section>

      {/* AI Features grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs font-medium mb-4">
            <Cpu className="h-3.5 w-3.5 text-accent" /> Smart Agri Stack
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold">
            Intelligence at <span className="neon-text">every farm gate</span>
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Six AI modules working together — from disease detection to dynamic pricing —
            so every harvest reaches its highest value.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              icon: ScanLine,
              accent: "primary" as const,
              t: "Crop Disease Vision",
              s: "Identify 200+ leaf and fruit pathogens from a single photo with our trained vision model.",
              tag: "vision",
            },
            {
              icon: LineChart,
              accent: "accent" as const,
              t: "Yield Forecast Engine",
              s: "Predict harvest output 8 weeks ahead using soil, weather, and historical yield data.",
              tag: "forecast",
            },
            {
              icon: Bot,
              accent: "secondary" as const,
              t: "Farm Copilot",
              s: "An AI assistant that answers planting, pest, and price questions in plain language.",
              tag: "assistant",
            },
            {
              icon: CloudSun,
              accent: "accent" as const,
              t: "Weather Telemetry",
              s: "Hyperlocal 14-day forecasts and drought alerts piped from satellite + field sensors.",
              tag: "telemetry",
            },
            {
              icon: Wallet,
              accent: "primary" as const,
              t: "Smart Pricing",
              s: "Dynamic recommended prices based on regional supply, demand, and seasonal trends.",
              tag: "market",
            },
            {
              icon: Globe2,
              accent: "secondary" as const,
              t: "Traceable Supply",
              s: "Every order tagged with origin, harvest date, and chain-of-custody on-platform.",
              tag: "trust",
            },
          ].map((f, i) => (
            <motion.div
              key={f.t}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="group glass rounded-2xl p-6 hover:border-primary/40 transition relative overflow-hidden"
            >
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/5 group-hover:bg-primary/10 transition blur-2xl" />
              <div className="relative">
                <div className="flex items-center justify-between">
                  <AnimatedIcon Icon={f.icon} accent={f.accent} size={52} />
                  <span className="text-[10px] uppercase tracking-wider font-mono text-muted-foreground">
                    /{f.tag}
                  </span>
                </div>
                <h3 className="mt-5 font-serif text-xl font-bold">{f.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.s}</p>
                <Link
                  href="/ai"
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:gap-2 transition-all"
                >
                  Explore module <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="glass-strong rounded-3xl p-8 sm:p-12 relative overflow-hidden">
          <div className="absolute inset-0 grid-bg opacity-30" />
          <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
          <div className="relative grid sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { v: 12438, sf: "+", l: "Verified farmers" },
              { v: 94.2, sf: "%", l: "AI diagnosis accuracy", dec: 1 },
              { v: 120, sf: "+", l: "Cities covered" },
              { v: 30, sf: "%", l: "Average buyer savings" },
            ].map((s, i) => (
              <div key={i}>
                <div className="font-serif text-4xl sm:text-5xl font-bold neon-text">
                  <Counter to={s.v} suffix={s.sf} decimals={s.dec ?? 0} />
                </div>
                <div className="mt-2 text-sm text-muted-foreground uppercase tracking-wider font-mono">
                  {s.l}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-end justify-between mb-6 flex-wrap gap-3">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs font-medium mb-3">
              <Leaf className="h-3.5 w-3.5 text-primary" /> Marketplace
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold">Shop by Category</h2>
          </div>
          <Link href="/browse" className="text-sm font-medium text-primary hover:underline">
            See all categories →
          </Link>
        </div>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
          {categories.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.03 }}
            >
              <Link
                href={`/browse?category=${c.id}`}
                className="group glass rounded-2xl p-4 text-center hover:border-primary/50 hover:bg-primary/5 transition block"
              >
                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{c.emoji}</div>
                <div className="text-[11px] sm:text-xs font-medium leading-tight">{c.name}</div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured deals */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold">
              Today's Best Deals <Zap className="inline h-6 w-6 text-secondary" />
            </h2>
            <p className="text-muted-foreground text-sm mt-1">AI-priced for maximum savings</p>
          </div>
          <Link href="/browse" className="text-sm font-medium text-primary hover:underline">
            See all →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Trusted vendors */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold">Trusted Farmers</h2>
            <p className="text-muted-foreground text-sm mt-1">
              Verified, AI-scored vendors across the country
            </p>
          </div>
          <Link href="/vendors" className="text-sm font-medium text-primary hover:underline">
            View all →
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {vendors.slice(0, 3).map((v) => (
            <Link
              key={v.id}
              href={`/vendor/${v.id}`}
              className="block glass rounded-2xl p-5 hover:border-primary/40 transition"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-semibold flex items-center gap-2">
                    {v.name}
                    {v.verified && (
                      <span className="text-[10px] uppercase font-bold neon-bg text-primary-foreground px-2 py-0.5 rounded-full">
                        Verified
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">{v.location}</div>
                </div>
                <div className="text-sm font-bold text-secondary">★ {v.rating}</div>
              </div>
              <p className="mt-3 text-sm text-muted-foreground line-clamp-2">{v.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Trending */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <h2 className="font-serif text-2xl sm:text-3xl font-bold mb-6">Trending Now</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {trending.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="relative overflow-hidden rounded-3xl glass-strong p-10 sm:p-16 text-center">
          <div className="absolute inset-0 grid-bg opacity-30" />
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-72 w-[80%] rounded-full bg-gradient-to-r from-primary via-accent to-secondary blur-3xl opacity-30" />
          <div className="relative">
            <Sparkles className="mx-auto h-8 w-8 text-secondary mb-4" />
            <h2 className="font-serif text-3xl sm:text-5xl font-bold">
              Ready to farm smarter,
              <br />
              <span className="neon-text">sell better?</span>
            </h2>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
              Join thousands of farmers and buyers using Agrillion's AI to grow more, waste less,
              and earn fairer prices.
            </p>
            <div className="mt-8 flex justify-center gap-3 flex-wrap">
              <Link
                href="/browse"
                className="px-6 py-3 rounded-full neon-bg text-primary-foreground font-semibold glow-primary"
              >
                Open Marketplace
              </Link>
              <Link
                href="/ai"
                className="px-6 py-3 rounded-full glass text-foreground font-semibold hover:border-primary/50"
              >
                Try the AI Lab →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
