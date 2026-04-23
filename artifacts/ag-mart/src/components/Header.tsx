import { Link, useLocation } from "wouter";
import { ShoppingCart, Search, Menu, X, Sparkles, UserPlus } from "lucide-react";
import { useState } from "react";
import { Logo } from "./Logo";
import { useCart } from "@/store/cart";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/browse", label: "Marketplace" },
  { to: "/ai-mart", label: "AI Mart", icon: true },
  { to: "/vendors", label: "Farmers" },
  { to: "/orders", label: "Orders" },
  { to: "/contact", label: "Contact" },
];

export function Header() {
  const [, navigate] = useLocation();
  const [location] = useLocation();
  const { totalCount } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [q, setQ] = useState("");

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (q.trim()) {
      navigate(`/browse?q=${encodeURIComponent(q.trim())}`);
      setMobileOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border/40 backdrop-blur-xl bg-background/70">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link href="/" className="shrink-0">
            <Logo size={36} />
          </Link>

          <form onSubmit={onSearch} className="hidden md:flex flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search produce, vendors, AI tools…"
                className="w-full h-10 pl-10 pr-4 rounded-full border border-border/60 bg-card/50 focus:bg-card focus:outline-none focus:ring-1 focus:ring-primary/50 text-sm placeholder:text-muted-foreground/70"
              />
            </div>
          </form>

          <nav className="hidden lg:flex items-center gap-0.5">
            {navItems.map((it) => {
              const active = location === it.to;
              return (
                <Link
                  key={it.to}
                  href={it.to}
                  className={`px-3 py-2 rounded-full text-sm font-medium transition flex items-center gap-1.5 ${
                    active
                      ? "text-primary"
                      : "text-foreground/70 hover:text-foreground"
                  }`}
                >
                  {it.icon && <Sparkles className="h-3.5 w-3.5" />}
                  {it.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/onboarding"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold border border-primary/40 text-primary hover:bg-primary/10 transition"
            >
              <UserPlus className="h-4 w-4" /> Join
            </Link>
            <Link
              href="/cart"
              className="relative inline-flex items-center justify-center h-10 w-10 rounded-full hover:bg-muted/40 transition"
              aria-label="Cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {totalCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 inline-flex items-center justify-center min-w-[20px] h-5 px-1 rounded-full neon-bg text-primary-foreground text-[11px] font-bold">
                  {totalCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="lg:hidden inline-flex items-center justify-center h-10 w-10 rounded-full hover:bg-muted/40"
              aria-label="Menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="lg:hidden pb-4 space-y-3">
            <form onSubmit={onSearch} className="md:hidden">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="search"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search…"
                  className="w-full h-10 pl-10 pr-4 rounded-full border border-border/60 bg-card/50 text-sm"
                />
              </div>
            </form>
            <div className="grid grid-cols-2 gap-2">
              {[...navItems, { to: "/onboarding", label: "Join" }].map((it) => (
                <Link
                  key={it.to}
                  href={it.to}
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-card/50 border border-border/40 text-sm font-medium text-center"
                >
                  {it.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
