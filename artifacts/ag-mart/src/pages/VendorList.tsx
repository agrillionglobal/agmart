import { useMemo, useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  Store, ShieldCheck, ArrowRight, CheckCircle2, Truck, Info, Sparkles,
} from "lucide-react";
import { AnimatedIcon } from "@/components/AnimatedIcon";
import { NIGERIAN_STATES } from "@/data/nigeria";
import { categories } from "@/data/catalog";
import { formatNaira } from "@/store/cart";
import { adminQueue } from "@/store/admin";

export default function VendorList() {
  const [submitted, setSubmitted] = useState(false);
  const [price, setPrice] = useState<number>(0);
  const [logistics, setLogistics] = useState<number>(0);
  const [includeLogistics, setIncludeLogistics] = useState(true);

  const split = useMemo(() => {
    const list = Math.max(0, price);
    const discount = list * 0.10;        // total 10% off list
    const systemFee = list * 0.05;       // 5% system
    const buyerRebate = list * 0.03;     // 3% buyer
    const platformReserve = list * 0.02; // remaining 2% reserve / vendor incentive
    const buyerPays = list - discount;
    const vendorReceives = list - discount - systemFee + buyerRebate * 0; // vendor gets list - 10% discount + nothing extra; buyer rebate funded from the discount pool
    // Simpler interpretation: buyer pays list - 10%; from that 10% pool: 5% system, 3% buyer rebate, 2% platform reserve
    const vendorNet = list - discount; // vendor gets the post-discount price
    const totalToBuyerInclLogistics = buyerPays + (includeLogistics ? logistics : 0) - buyerRebate;
    return {
      list, discount, systemFee, buyerRebate, platformReserve,
      buyerPays, vendorNet, totalToBuyerInclLogistics,
    };
  }, [price, logistics, includeLogistics]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget as HTMLFormElement);
    const name = String(fd.get("productName") || "Untitled product");
    const category = String(fd.get("category") || "");
    const unit = String(fd.get("unit") || "");
    const state = String(fd.get("state") || "");
    const town = String(fd.get("town") || "");
    const quantity = Number(fd.get("quantity") || 0);
    adminQueue.add({
      type: "listing",
      title: `${name}${unit ? " · " + unit : ""}`,
      subtitle: `${town}${state ? ", " + state : ""}`,
      data: {
        category, unit, state, location: town, quantity,
        listPrice: price,
        logisticsFee: includeLogistics ? logistics : 0,
        buyerPays: split.buyerPays,
        vendorReceives: split.vendorNet - split.systemFee,
      },
    });
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/40">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="absolute -top-32 -right-20 h-80 w-80 rounded-full bg-secondary/15 blur-3xl animate-float" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border/60 bg-card/30 text-xs font-medium mb-4 text-muted-foreground">
              <Store className="h-3.5 w-3.5 text-secondary" /> Vendor portal · Admin-approved
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-semibold tracking-tight">
              List a product on{" "}
              <span className="neon-text">Agrillion Mart</span>
            </h1>
            <p className="mt-4 text-foreground/65 max-w-xl leading-relaxed">
              Submit your listing with state, location, quantity and price. We'll preview the
              transparent split — 10% buyer discount, 5% system, 3% buyer rebate — before our
              admin team approves it for the live marketplace.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {submitted ? (
          <div className="rounded-3xl border border-primary/40 bg-card/40 p-10 text-center max-w-2xl mx-auto">
            <div className="mx-auto h-14 w-14 rounded-full neon-bg flex items-center justify-center mb-4">
              <CheckCircle2 className="h-7 w-7 text-primary-foreground" />
            </div>
            <h2 className="font-serif text-2xl font-semibold">Listing sent for approval</h2>
            <p className="text-muted-foreground mt-2 text-sm">
              Our admin team reviews new listings within 24 hours. You'll be notified by email
              when your product goes live on the marketplace.
            </p>
            <div className="mt-6 flex justify-center gap-3 flex-wrap">
              <button
                onClick={() => setSubmitted(false)}
                className="px-5 py-2.5 rounded-full border border-border/60 text-sm font-medium hover:border-primary/50"
              >
                List another product
              </button>
              <Link
                href="/ai-mart"
                className="px-5 py-2.5 rounded-full neon-bg text-primary-foreground text-sm font-semibold"
              >
                Open AI Mart
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            <form
              onSubmit={onSubmit}
              className="lg:col-span-2 rounded-3xl border border-border/50 bg-card/30 p-6 sm:p-8 space-y-5"
            >
              <div className="flex items-center gap-3">
                <AnimatedIcon Icon={Store} accent="secondary" size={44} />
                <div>
                  <div className="font-serif text-xl font-semibold">Product details</div>
                  <div className="text-xs text-muted-foreground font-mono">/vendor/list</div>
                </div>
              </div>

              <Field name="productName" label="Product name" placeholder="e.g. Premium yellow maize" required />

              <div className="grid sm:grid-cols-2 gap-4">
                <SelectField
                  name="category"
                  label="Category"
                  options={categories.map((c) => c.name)}
                  required
                />
                <Field name="unit" label="Unit" placeholder="e.g. 50kg bag, crate, kg" required />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <SelectField name="state" label="State" options={[...NIGERIAN_STATES]} required />
                <Field name="town" label="Location / town" placeholder="e.g. Bodija, Ibadan" required />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <Field
                  name="quantity"
                  label="Quantity available"
                  type="number"
                  placeholder="e.g. 200"
                  required
                />
                <NumberField
                  label="List price (₦)"
                  placeholder="e.g. 22000"
                  required
                  onChangeNumber={setPrice}
                />
              </div>

              <div className="rounded-2xl border border-border/50 bg-background/40 p-4">
                <div className="flex items-center justify-between gap-3">
                  <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeLogistics}
                      onChange={(e) => setIncludeLogistics(e.target.checked)}
                      className="accent-primary h-4 w-4"
                    />
                    <Truck className="h-4 w-4 text-accent" /> Add logistics fee
                  </label>
                  <span className="text-[10px] uppercase font-mono text-muted-foreground">
                    matched to location
                  </span>
                </div>
                {includeLogistics && (
                  <NumberField
                    label="Base logistics fee (₦)"
                    placeholder="e.g. 3500"
                    onChangeNumber={setLogistics}
                    compact
                  />
                )}
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  Logistics is matched to the buyer's delivery state. The fee shown to buyers
                  may adjust based on distance and partner availability.
                </p>
              </div>

              <Field
                label="Description"
                placeholder="Variety, harvest date, packaging, MOQ…"
                multiline
              />

              <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 flex items-start gap-3 text-xs">
                <ShieldCheck className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <div className="text-foreground/80">
                  Listings go through admin review before appearing on the marketplace.
                  Approval typically takes under 24 hours.
                </div>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full neon-bg text-primary-foreground font-semibold glow-primary"
              >
                Submit for approval <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            {/* Live split preview */}
            <aside className="rounded-3xl border border-border/50 bg-card/30 p-6 h-fit lg:sticky lg:top-20">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-4 w-4 text-secondary" />
                <div className="font-serif text-lg font-semibold">Transparent split</div>
              </div>
              <div className="text-xs text-muted-foreground mb-4">
                Live preview based on your list price.
              </div>

              <Row label="List price" value={split.list} bold />
              <Row
                label="Buyer discount (10%)"
                value={-split.discount}
                muted
              />
              <div className="my-2 border-t border-dashed border-border/60" />
              <Row label="System fee (5%)" value={split.systemFee} small />
              <Row label="Buyer rebate (3%)" value={split.buyerRebate} small accent />
              <Row label="Platform reserve (2%)" value={split.platformReserve} small muted />
              <div className="my-3 border-t border-border/60" />
              <Row label="Buyer pays" value={split.buyerPays} bold />
              {includeLogistics && logistics > 0 && (
                <Row label="+ Logistics (matched)" value={logistics} small accent />
              )}
              <Row
                label="Vendor receives"
                value={split.vendorNet - split.systemFee}
                bold
                primary
              />

              <div className="mt-5 rounded-xl border border-border/50 bg-background/40 p-3 flex items-start gap-2 text-[11px] text-muted-foreground leading-relaxed">
                <Info className="h-3.5 w-3.5 text-accent mt-0.5 shrink-0" />
                Vendor net = (list − 10% discount) − 5% system fee. The 3% buyer rebate is
                credited back to the buyer; 2% stays as platform reserve.
              </div>
            </aside>
          </div>
        )}
      </section>
    </div>
  );
}

function Row({
  label, value, bold, muted, accent, primary, small,
}: {
  label: string; value: number; bold?: boolean; muted?: boolean;
  accent?: boolean; primary?: boolean; small?: boolean;
}) {
  const cls = [
    "flex items-center justify-between py-1.5",
    small ? "text-xs" : "text-sm",
    bold ? "font-semibold" : "",
    muted ? "text-muted-foreground" : "",
    accent ? "text-accent" : "",
    primary ? "text-primary" : "",
  ].join(" ");
  return (
    <div className={cls}>
      <span>{label}</span>
      <motion.span key={value} initial={{ opacity: 0.4 }} animate={{ opacity: 1 }}>
        {value < 0 ? `− ${formatNaira(Math.abs(value))}` : formatNaira(value)}
      </motion.span>
    </div>
  );
}

function Field({
  label, type = "text", placeholder, required, multiline, name,
}: {
  label: string; type?: string; placeholder?: string;
  required?: boolean; multiline?: boolean; name?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-muted-foreground">{label}{required && " *"}</span>
      {multiline ? (
        <textarea
          name={name}
          rows={3}
          placeholder={placeholder}
          required={required}
          className="mt-1.5 w-full px-3.5 py-2.5 rounded-xl bg-background/50 border border-border/60 focus:border-primary/60 focus:outline-none text-sm resize-none"
        />
      ) : (
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          required={required}
          className="mt-1.5 w-full h-11 px-3.5 rounded-xl bg-background/50 border border-border/60 focus:border-primary/60 focus:outline-none text-sm"
        />
      )}
    </label>
  );
}

function NumberField({
  label, placeholder, required, onChangeNumber, compact,
}: {
  label: string; placeholder?: string; required?: boolean;
  onChangeNumber: (n: number) => void; compact?: boolean;
}) {
  return (
    <label className={`block ${compact ? "mt-3" : ""}`}>
      <span className="text-xs font-medium text-muted-foreground">{label}{required && " *"}</span>
      <input
        type="number"
        min={0}
        placeholder={placeholder}
        required={required}
        onChange={(e) => onChangeNumber(Number(e.target.value) || 0)}
        className="mt-1.5 w-full h-11 px-3.5 rounded-xl bg-background/50 border border-border/60 focus:border-primary/60 focus:outline-none text-sm"
      />
    </label>
  );
}

function SelectField({
  label, options, required, name,
}: { label: string; options: string[]; required?: boolean; name?: string }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-muted-foreground">{label}{required && " *"}</span>
      <select
        name={name}
        required={required}
        defaultValue=""
        className="mt-1.5 w-full h-11 px-3 rounded-xl bg-background/50 border border-border/60 focus:border-primary/60 focus:outline-none text-sm"
      >
        <option value="" disabled>Select…</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );
}
