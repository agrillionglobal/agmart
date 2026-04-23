import { Link } from "wouter";
import { ArrowRight, ShieldCheck, Truck, Sparkles, Leaf } from "lucide-react";
import { categories, products, vendors } from "@/data/catalog";
import { ProductCard } from "@/components/ProductCard";
import { Logo } from "@/components/Logo";

export default function Home() {
  const featured = products.filter((p) => p.originalPrice).slice(0, 4);
  const trending = products.slice(0, 8);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 leaf-bg opacity-95" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(244,209,96,0.35),transparent_60%)]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24 grid lg:grid-cols-2 gap-10 items-center">
          <div className="text-white">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur border border-white/20 text-xs font-medium mb-5">
              <Sparkles className="h-3.5 w-3.5" /> Farm gate prices, direct to you
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              From the farm.<br />
              <span className="gold-text">To your table.</span>
            </h1>
            <p className="mt-5 text-white/90 text-lg max-w-lg">
              Skip the middlemen. Shop fresh produce, livestock, and farm inputs directly from
              verified farmers across the country.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/browse"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-primary font-semibold hover:bg-white/90 transition shadow-lg"
              >
                Shop Marketplace <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/vendors"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/30 text-white hover:bg-white/10 transition font-semibold"
              >
                Meet Our Farmers
              </Link>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-4 max-w-md">
              {[
                { n: "5,000+", l: "Verified vendors" },
                { n: "120+", l: "Cities covered" },
                { n: "30%", l: "Avg savings" },
              ].map((s) => (
                <div key={s.l}>
                  <div className="text-2xl font-bold gold-text">{s.n}</div>
                  <div className="text-xs text-white/75">{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="hidden lg:flex justify-center">
            <div className="relative">
              <div className="absolute -inset-8 rounded-full bg-white/10 blur-2xl" />
              <div className="relative bg-white rounded-3xl p-8 shadow-2xl">
                <Logo size={120} withText={false} />
                <div className="mt-6 text-center">
                  <div className="font-serif text-3xl font-bold gold-text">AGRILLION MART</div>
                  <div className="mt-1 text-xs uppercase tracking-[0.3em] text-muted-foreground">
                    — AG MART —
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-y bg-muted/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: ShieldCheck, t: "Escrow Protected", s: "Pay with confidence" },
            { icon: Truck, t: "Fast Delivery", s: "Nationwide network" },
            { icon: Leaf, t: "Farm Fresh", s: "Picked to order" },
            { icon: Sparkles, t: "AG Points", s: "Earn on every order" },
          ].map((f) => (
            <div key={f.t} className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <f.icon className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-semibold">{f.t}</div>
                <div className="text-xs text-muted-foreground">{f.s}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold">Shop by Category</h2>
            <p className="text-muted-foreground text-sm mt-1">Everything from the farm, in one place</p>
          </div>
        </div>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/browse?category=${c.id}`}
              className="group bg-card border rounded-2xl p-4 text-center hover:border-primary hover:shadow-md transition"
            >
              <div className="text-3xl mb-2 group-hover:scale-110 transition">{c.emoji}</div>
              <div className="text-xs font-medium leading-tight">{c.name}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured deals */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold">Today's Best Deals</h2>
            <p className="text-muted-foreground text-sm mt-1">Save big on farm-direct prices</p>
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
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold">Trusted Vendors</h2>
            <p className="text-muted-foreground text-sm mt-1">Verified farmers and co-ops you can trust</p>
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
              className="block bg-card border rounded-2xl p-5 hover:shadow-md hover:border-primary/40 transition"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-semibold flex items-center gap-2">
                    {v.name}
                    {v.verified && <span className="text-primary text-xs">✓</span>}
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
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 pb-12">
        <h2 className="font-serif text-2xl sm:text-3xl font-bold mb-6">Trending Now</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {trending.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
