import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import {
  Sprout, Tractor, Truck, Store, ShoppingBasket, ArrowRight,
  CheckCircle2, ShieldCheck,
} from "lucide-react";
import { AnimatedIcon } from "@/components/AnimatedIcon";
import { NIGERIAN_STATES } from "@/data/nigeria";

type Role = "farmer" | "vendor" | "logistics" | "buyer";

const roles: {
  id: Role;
  title: string;
  tag: string;
  blurb: string;
  Icon: typeof Sprout;
  accent: "primary" | "secondary" | "accent";
  bullets: string[];
}[] = [
  {
    id: "farmer",
    title: "Farmers",
    tag: "Big & small farms",
    blurb: "Onboard your farm — from a single plot to a 1,000-hectare estate. We classify you automatically and unlock the right tools.",
    Icon: Tractor,
    accent: "primary",
    bullets: [
      "Choose Small farm (≤ 5 ha) or Big farm (> 5 ha)",
      "Get matched buyers in your state",
      "Free quality control via AI Mart",
      "Direct payouts after delivery",
    ],
  },
  {
    id: "vendor",
    title: "Vendors",
    tag: "Resellers & aggregators",
    blurb: "List farm produce, livestock and inputs. Every listing is admin-reviewed before going live to protect buyer trust.",
    Icon: Store,
    accent: "secondary",
    bullets: [
      "Admin-approved listings",
      "Built-in 10% buyer discount, transparent splits",
      "Inventory auto-tracked in AI Mart",
      "Withdraw anytime, weekly settlement",
    ],
  },
  {
    id: "logistics",
    title: "Logistics partners",
    tag: "Riders, vans & cold-chain",
    blurb: "Earn by moving goods. Our routing engine matches deliveries to your state and vehicle type in real time.",
    Icon: Truck,
    accent: "accent",
    bullets: [
      "Auto-matched to nearby orders",
      "Set your base fee per state/route",
      "Cold-chain & dry-cargo lanes",
      "Insurance-backed shipments",
    ],
  },
  {
    id: "buyer",
    title: "Buyers",
    tag: "Households & businesses",
    blurb: "Source verified produce at farm-gate prices. Get a 3% buyer rebate on every approved order — automatically.",
    Icon: ShoppingBasket,
    accent: "primary",
    bullets: [
      "10% off list, 3% rebate on you",
      "Escrow-protected payments",
      "Live state-by-state availability",
      "Logistics fee shown upfront",
    ],
  },
];

export default function Onboarding() {
  const [location] = useLocation();
  const params = new URLSearchParams(location.split("?")[1] || "");
  const initial = (params.get("role") as Role) || "farmer";
  const [active, setActive] = useState<Role>(initial);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setSubmitted(false);
  }, [active]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const r = roles.find((x) => x.id === active)!;

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
              <Sprout className="h-3.5 w-3.5 text-primary" /> Join Agrillion · Smart AG Mart
            </div>
            <h1 className="font-serif text-4xl sm:text-6xl font-semibold leading-tight tracking-tight">
              <span className="text-foreground/90">One platform.</span>
              <br />
              <span className="neon-text">Four ways to grow.</span>
            </h1>
            <p className="mt-5 text-lg text-foreground/65 max-w-2xl leading-relaxed">
              Choose your role to onboard. Every account is reviewed by our admin team before
              it goes live — keeping the marketplace clean, trusted, and fair.
            </p>
          </div>
        </div>
      </section>

      {/* Role cards */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {roles.map((role, i) => {
            const isActive = active === role.id;
            return (
              <motion.button
                key={role.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setActive(role.id)}
                className={`text-left rounded-2xl p-5 border transition relative overflow-hidden ${
                  isActive
                    ? "border-primary/60 bg-primary/5 glow-primary"
                    : "border-border/50 bg-card/30 hover:border-primary/30"
                }`}
              >
                {isActive && (
                  <div className="absolute top-3 right-3 text-[10px] uppercase font-mono text-primary">
                    selected
                  </div>
                )}
                <AnimatedIcon Icon={role.Icon} accent={role.accent} size={48} />
                <div className="mt-4 font-serif text-xl font-semibold">{role.title}</div>
                <div className="text-xs text-muted-foreground font-mono mt-0.5">{role.tag}</div>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{role.blurb}</p>
              </motion.button>
            );
          })}
        </div>

        {/* Form */}
        <div className="mt-10 grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {submitted ? (
              <div className="rounded-3xl border border-primary/40 bg-card/40 p-10 text-center">
                <div className="mx-auto h-14 w-14 rounded-full neon-bg flex items-center justify-center mb-4">
                  <CheckCircle2 className="h-7 w-7 text-primary-foreground" />
                </div>
                <h2 className="font-serif text-2xl font-semibold">Application received</h2>
                <p className="text-muted-foreground mt-2 max-w-md mx-auto text-sm">
                  Our admin team reviews new {r.title.toLowerCase()} applications within 24–48 hours.
                  You'll get an email once your account is approved.
                </p>
              </div>
            ) : (
              <form
                onSubmit={onSubmit}
                className="rounded-3xl border border-border/50 bg-card/30 p-6 sm:p-8 space-y-5"
              >
                <div className="flex items-center gap-3">
                  <AnimatedIcon Icon={r.Icon} accent={r.accent} size={44} />
                  <div>
                    <div className="font-serif text-xl font-semibold">Sign up as {r.title}</div>
                    <div className="text-xs text-muted-foreground font-mono">/{r.id}-onboarding</div>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Full name" placeholder="e.g. Aisha Bello" required />
                  <Field label="Email" type="email" placeholder="you@example.com" required />
                  <Field label="Phone" placeholder="+234 …" required />
                  <SelectField label="State" options={[...NIGERIAN_STATES]} required />
                </div>

                {active === "farmer" && (
                  <div className="grid sm:grid-cols-2 gap-4">
                    <SelectField
                      label="Farm size"
                      options={["Small farm (≤ 5 hectares)", "Big farm (> 5 hectares)"]}
                      required
                    />
                    <Field label="Primary crop / livestock" placeholder="e.g. Maize, Poultry" />
                  </div>
                )}

                {active === "vendor" && (
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field label="Business name" placeholder="e.g. Bello Foods Ltd." required />
                    <SelectField
                      label="Category focus"
                      options={["Produce", "Livestock", "Inputs & feeds", "Mixed"]}
                    />
                  </div>
                )}

                {active === "logistics" && (
                  <div className="grid sm:grid-cols-2 gap-4">
                    <SelectField
                      label="Vehicle type"
                      options={["Bike", "Tricycle", "Van", "Truck (cold-chain)", "Truck (dry)"]}
                      required
                    />
                    <Field label="Routes / states served" placeholder="e.g. Lagos ↔ Oyo" />
                  </div>
                )}

                {active === "buyer" && (
                  <div className="grid sm:grid-cols-2 gap-4">
                    <SelectField
                      label="Account type"
                      options={["Household", "Restaurant / HoReCa", "Retailer", "Processor"]}
                    />
                    <Field label="Estimated monthly spend (₦)" placeholder="e.g. 250,000" />
                  </div>
                )}

                <div className="rounded-xl border border-border/50 bg-background/40 p-4 flex items-start gap-3 text-xs text-muted-foreground">
                  <ShieldCheck className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <div>
                    Every account is admin-reviewed before activation. We verify identity,
                    business documents and (for vendors) sample listings to keep the marketplace clean.
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full neon-bg text-primary-foreground font-semibold glow-primary"
                >
                  Submit for approval <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            )}
          </div>

          <aside className="rounded-3xl border border-border/50 bg-card/30 p-6">
            <div className="text-xs uppercase font-mono text-muted-foreground mb-3">
              What you get
            </div>
            <ul className="space-y-3">
              {r.bullets.map((b) => (
                <li key={b} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <span className="text-foreground/80">{b}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 pt-5 border-t border-border/50 text-xs text-muted-foreground">
              Already onboarded? Reach out to <span className="text-primary">support@agrillionmart.store</span> to access your dashboard.
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}

function Field({
  label, type = "text", placeholder, required,
}: { label: string; type?: string; placeholder?: string; required?: boolean }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-muted-foreground">{label}{required && " *"}</span>
      <input
        type={type}
        placeholder={placeholder}
        required={required}
        className="mt-1.5 w-full h-11 px-3.5 rounded-xl bg-background/50 border border-border/60 focus:border-primary/60 focus:outline-none text-sm"
      />
    </label>
  );
}

function SelectField({
  label, options, required,
}: { label: string; options: string[]; required?: boolean }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-muted-foreground">{label}{required && " *"}</span>
      <select
        required={required}
        defaultValue=""
        className="mt-1.5 w-full h-11 px-3 rounded-xl bg-background/50 border border-border/60 focus:border-primary/60 focus:outline-none text-sm"
      >
        <option value="" disabled>Select…</option>
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </label>
  );
}
