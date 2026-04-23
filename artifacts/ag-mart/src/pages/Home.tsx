import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  ArrowRight, ShieldCheck, Truck, Sparkles, Leaf, Zap, Tractor, Store,
  ShoppingBasket, UserPlus,
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
          { icon: ShieldCheck, t: "Admin-curated", s: "Every vendor & listing reviewed" },
          { icon: Truck, t: "Logistics matched", s: "Partners chosen by location" },
          { icon: Sparkles, t: "AI Mart QC", s: "Quality scored on every batch" },
          { icon: ShoppingBasket, t: "3% buyer rebate", s: "Auto-credited on each order" },
        ].map((f, i) => (
          <motion.div
            key={f.t}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="rounded-2xl border border-border/50 bg-card/30 p-4 flex items-center gap-3"
          >
            <AnimatedIcon Icon={f.icon} accent={i % 2 === 0 ? "primary" : "accent"} size={44} />
            <div>
              <div className="text-sm font-semibold">{f.t}</div>
              <div className="text-xs text-muted-foreground">{f.s}</div>
            </div>
          </motion.div>
        ))}
      </section>

      {/* Onboarding section — 4 paths */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border/60 bg-card/30 text-xs font-medium mb-3 text-muted-foreground">
            <UserPlus className="h-3.5 w-3.5 text-primary" /> Join the network
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-semibold tracking-tight">
            <span className="text-foreground/90">One platform.</span>{" "}
            <span className="neon-text">Four ways in.</span>
          </h2>
          <p className="mt-4 text-foreground/65 text-lg leading-relaxed">
            Onboard as a farmer, vendor, logistics partner or buyer. Every account is
            admin-reviewed before it goes live.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              Icon: Tractor, accent: "primary" as const,
              t: "Farmers", tag: "Big & small farms",
              s: "Onboard your farm — single plot or 1,000-hectare estate. Auto-classified small or big.",
              to: "/onboarding?role=farmer",
            },
            {
              Icon: Store, accent: "secondary" as const,
              t: "Vendors", tag: "Resellers & aggregators",
              s: "List goods with state, location, quantity & price. Admin-approved before going live.",
              to: "/onboarding?role=vendor",
            },
            {
              Icon: Truck, accent: "accent" as const,
              t: "Logistics", tag: "Riders, vans, cold-chain",
              s: "Get matched to deliveries by location. Set your own state-by-state base fee.",
              to: "/onboarding?role=logistics",
            },
            {
              Icon: ShoppingBasket, accent: "primary" as const,
              t: "Buyers", tag: "Households & businesses",
              s: "Source verified produce at farm-gate prices. Get an automatic 3% rebate on every order.",
              to: "/onboarding?role=buyer",
            },
          ].map((c, i) => (
            <motion.div
              key={c.t}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                href={c.to}
                className="block rounded-2xl border border-border/50 bg-card/30 p-5 hover:border-primary/40 hover:-translate-y-0.5 transition-all relative overflow-hidden h-full"
              >
                <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/5 blur-2xl" />
                <div className="relative">
                  <AnimatedIcon Icon={c.Icon} accent={c.accent} size={48} />
                  <div className="mt-4 font-serif text-xl font-semibold">{c.t}</div>
                  <div className="text-xs text-muted-foreground font-mono mt-0.5">{c.tag}</div>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{c.s}</p>
                  <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                    Sign up <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="rounded-3xl border border-border/50 bg-card/30 p-8 sm:p-12 relative overflow-hidden">
          <div className="absolute inset-0 grid-bg opacity-30" />
          <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-accent/15 blur-3xl" />
          <div className="relative grid sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { v: 12438, sf: "+", l: "Verified farmers" },
              { v: 94.2, sf: "%", l: "AI QC accuracy", dec: 1 },
              { v: 120, sf: "+", l: "Cities covered" },
              { v: 30, sf: "%", l: "Average buyer savings" },
            ].map((s, i) => (
              <div key={i}>
                <div className="font-serif text-4xl sm:text-5xl font-semibold neon-text">
                  <Counter to={s.v} suffix={s.sf} decimals={s.dec ?? 0} />
                </div>
                <div className="mt-2 text-xs text-muted-foreground uppercase tracking-wider font-mono">
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border/60 bg-card/30 text-xs font-medium mb-3 text-muted-foreground">
              <Leaf className="h-3.5 w-3.5 text-primary" /> Marketplace
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold tracking-tight">
              Shop by Category
            </h2>
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
                className="group rounded-2xl border border-border/50 bg-card/30 p-4 text-center hover:border-primary/50 hover:bg-primary/5 transition block"
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
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold tracking-tight">
              Today's Best Deals <Zap className="inline h-6 w-6 text-secondary" />
            </h2>
            <p className="text-muted-foreground text-sm mt-1">
              10% off list, 3% rebate auto-credited to buyers
            </p>
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
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold tracking-tight">
              Trusted Farmers
            </h2>
            <p className="text-muted-foreground text-sm mt-1">
              Admin-approved, AI-scored vendors across Nigeria
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
              className="block rounded-2xl border border-border/50 bg-card/30 p-5 hover:border-primary/40 transition"
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
        <h2 className="font-serif text-2xl sm:text-3xl font-semibold tracking-tight mb-6">
          Trending Now
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {trending.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="relative overflow-hidden rounded-3xl border border-border/50 bg-card/30 p-10 sm:p-16 text-center">
          <div className="absolute inset-0 grid-bg opacity-30" />
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-72 w-[80%] rounded-full bg-gradient-to-r from-primary via-accent to-secondary blur-3xl opacity-25" />
          <div className="relative">
            <Sparkles className="mx-auto h-8 w-8 text-secondary mb-4" />
            <h2 className="font-serif text-3xl sm:text-5xl font-semibold tracking-tight">
              <span className="text-foreground/90">Ready to farm smarter,</span>
              <br />
              <span className="neon-text">sell better?</span>
            </h2>
            <p className="mt-4 text-foreground/65 max-w-xl mx-auto">
              Join thousands of farmers, vendors and buyers using Agrillion to grow more,
              waste less, and earn fairer prices.
            </p>
            <div className="mt-8 flex justify-center gap-3 flex-wrap">
              <Link
                href="/onboarding"
                className="px-6 py-3 rounded-full neon-bg text-primary-foreground font-semibold glow-primary"
              >
                Sign up
              </Link>
              <Link
                href="/ai-mart"
                className="px-6 py-3 rounded-full border border-border/60 text-foreground font-medium hover:border-primary/50"
              >
                Open AI Mart →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
