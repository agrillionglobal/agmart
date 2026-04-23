import { Link, useLocation } from "wouter";
import { ShoppingCart, Search, Menu, X } from "lucide-react";
import { useState } from "react";
import { Logo } from "./Logo";
import { useCart } from "@/store/cart";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/browse", label: "Browse" },
  { to: "/vendors", label: "Vendors" },
  { to: "/orders", label: "Orders" },
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
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link href="/" className="shrink-0">
            <Logo size={36} />
          </Link>

          <form onSubmit={onSearch} className="hidden md:flex flex-1 max-w-xl">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search produce, vendors, categories…"
                className="w-full h-10 pl-10 pr-4 rounded-full border bg-muted/50 focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
              />
            </div>
          </form>

          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((it) => {
              const active = location === it.to;
              return (
                <Link
                  key={it.to}
                  href={it.to}
                  className={`px-3 py-2 rounded-full text-sm font-medium transition ${
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-foreground/70 hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {it.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/cart"
              className="relative inline-flex items-center justify-center h-10 w-10 rounded-full hover:bg-muted transition"
              aria-label="Cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {totalCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 inline-flex items-center justify-center min-w-[20px] h-5 px-1 rounded-full bg-secondary text-secondary-foreground text-[11px] font-bold">
                  {totalCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="lg:hidden inline-flex items-center justify-center h-10 w-10 rounded-full hover:bg-muted"
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
                  className="w-full h-10 pl-10 pr-4 rounded-full border bg-muted/50 text-sm"
                />
              </div>
            </form>
            <div className="grid grid-cols-2 gap-2">
              {navItems.map((it) => (
                <Link
                  key={it.to}
                  href={it.to}
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-2.5 rounded-lg bg-muted text-sm font-medium text-center"
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
