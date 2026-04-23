import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import {
  Sparkles,
  Brain,
  ShoppingBag,
  Satellite,
  ArrowRight,
  CircleDot,
} from "lucide-react";

type Slide = {
  eyebrow: string;
  title: string;
  highlight: string;
  description: string;
  cta: { label: string; to: string };
  altCta?: { label: string; to: string };
  image: string;
  Icon: typeof Sparkles;
  accent: "primary" | "secondary" | "accent";
};

const slides: Slide[] = [
  {
    eyebrow: "Admin-curated marketplace",
    title: "From the farm.",
    highlight: "Intelligently to your table.",
    description:
      "An admin-approved marketplace where verified vendors list goods at fair prices — with built-in 10% buyer-savings, system rebates, and matched logistics.",
    cta: { label: "Enter Marketplace", to: "/browse" },
    altCta: { label: "Join the network", to: "/onboarding" },
    image:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=80",
    Icon: ShoppingBag,
    accent: "primary",
  },
  {
    eyebrow: "AI Mart · quality & inventory",
    title: "Diagnose quality.",
    highlight: "Track every unit.",
    description:
      "AI Mart watches your stock around the clock — quality control on every batch, automated inventory updates per vendor, and instant restock alerts.",
    cta: { label: "Open AI Mart", to: "/ai-mart" },
    altCta: { label: "List a product", to: "/vendor/list" },
    image:
      "https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=1600&q=80",
    Icon: Brain,
    accent: "accent",
  },
  {
    eyebrow: "Logistics matched to location",
    title: "From any state.",
    highlight: "Delivered, fully tracked.",
    description:
      "Buyers see live state-by-state availability across Nigeria. Logistics partners are matched automatically by route — fees previewed before checkout.",
    cta: { label: "View Vendors", to: "/vendors" },
    altCta: { label: "Become a partner", to: "/onboarding?role=logistics" },
    image:
      "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=1600&q=80",
    Icon: Satellite,
    accent: "secondary",
  },
];

const accentRing: Record<Slide["accent"], string> = {
  primary: "ring-primary/40 text-primary",
  secondary: "ring-secondary/40 text-secondary",
  accent: "ring-accent/40 text-accent",
};

export function HeroSlider() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % slides.length), 7000);
    return () => clearInterval(t);
  }, []);

  const slide = slides[idx];

  return (
    <section className="relative overflow-hidden border-b border-border/40">
      <div className="absolute inset-0 grid-bg opacity-40" />

      <AnimatePresence mode="wait">
        <motion.div
          key={`bg-${idx}`}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 0.28, scale: 1 }}
          exit={{ opacity: 0, scale: 1 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${slide.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-tr from-background via-background/85 to-background/40" />

      <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-primary/15 blur-3xl animate-float" />
      <div className="absolute top-20 -right-20 h-72 w-72 rounded-full bg-accent/15 blur-3xl animate-float" style={{ animationDelay: "2s" }} />
      <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-secondary/10 blur-3xl animate-float" style={{ animationDelay: "4s" }} />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-12 gap-10 items-center min-h-[520px]">
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={`text-${idx}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border/60 bg-card/30 text-xs font-medium mb-5 text-muted-foreground">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-75 animate-ping" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                  </span>
                  {slide.eyebrow}
                </div>

                <h1 className="font-serif text-4xl sm:text-5xl lg:text-7xl font-semibold leading-[1.05] tracking-tight">
                  <span className="text-foreground/90">{slide.title}</span>
                  <br />
                  <span className="neon-text">{slide.highlight}</span>
                </h1>

                <p className="mt-6 text-foreground/65 text-lg max-w-xl leading-relaxed">
                  {slide.description}
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href={slide.cta.to}
                    className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-full neon-bg text-primary-foreground font-semibold transition shadow-lg glow-primary"
                  >
                    {slide.cta.label}
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </Link>
                  {slide.altCta && (
                    <Link
                      href={slide.altCta.to}
                      className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-border/60 text-foreground/85 hover:border-primary/50 hover:text-foreground transition font-medium"
                    >
                      {slide.altCta.label}
                    </Link>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="mt-10 flex items-center gap-3">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIdx(i)}
                  className="group flex items-center gap-2"
                  aria-label={`Slide ${i + 1}`}
                >
                  <div
                    className={`h-1.5 rounded-full transition-all ${
                      i === idx ? "w-12 bg-primary" : "w-6 bg-muted hover:bg-muted-foreground/40"
                    }`}
                  />
                </button>
              ))}
              <div className="ml-3 font-mono text-xs text-muted-foreground">
                0{idx + 1} <span className="text-foreground/30">/ 0{slides.length}</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 hidden lg:block">
            <AnimatePresence mode="wait">
              <motion.div
                key={`card-${idx}`}
                initial={{ opacity: 0, scale: 0.92, rotate: -2 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.92, rotate: 2 }}
                transition={{ duration: 0.5 }}
                className="relative"
              >
                <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-tr from-primary/20 via-accent/20 to-secondary/20 blur-2xl" />

                <div className="relative glass-strong rounded-3xl overflow-hidden">
                  <div className="aspect-[5/4] overflow-hidden relative">
                    <img src={slide.image} alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                    <div className="absolute inset-x-0 h-12 bg-gradient-to-b from-transparent via-primary/30 to-transparent animate-scan" />
                    {[
                      "top-3 left-3",
                      "top-3 right-3 rotate-90",
                      "bottom-3 right-3 rotate-180",
                      "bottom-3 left-3 -rotate-90",
                    ].map((pos, i) => (
                      <div
                        key={i}
                        className={`absolute ${pos} h-5 w-5 border-l-2 border-t-2 border-primary/70`}
                      />
                    ))}
                  </div>
                  <div className="p-5 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground font-mono">
                        Module
                      </div>
                      <div className="font-serif font-semibold text-lg">{slide.eyebrow}</div>
                    </div>
                    <div
                      className={`h-12 w-12 rounded-xl bg-card/60 border border-border/60 flex items-center justify-center ring-1 ${accentRing[slide.accent]}`}
                    >
                      <slide.Icon className="h-5 w-5" />
                    </div>
                  </div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="absolute bottom-24 -left-8 glass-strong rounded-2xl px-4 py-3 flex items-center gap-3 shadow-xl"
                >
                  <CircleDot className="h-4 w-4 text-primary animate-blink" />
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono">
                      Live signal
                    </div>
                    <div className="text-sm font-semibold">12,438 farms online</div>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="absolute -top-4 -right-4 glass-strong rounded-2xl px-4 py-3 flex items-center gap-3 shadow-xl"
                >
                  <Sparkles className="h-4 w-4 text-secondary" />
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono">
                      QC accuracy
                    </div>
                    <div className="text-sm font-semibold neon-text">94.2%</div>
                  </div>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
