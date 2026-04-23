import { Logo } from "./Logo";
import { Link } from "wouter";
import { Github, Twitter, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo size={44} />
          <p className="mt-4 text-sm text-muted-foreground max-w-md leading-relaxed">
            Agrillion Mart — Smart AG Mart. An admin-curated, AI-powered marketplace
            connecting farmers, vendors, logistics partners and buyers across Nigeria.
          </p>
          <div className="mt-5 flex gap-2">
            {[Github, Twitter, Linkedin].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="h-9 w-9 rounded-full border border-border/60 flex items-center justify-center hover:border-primary/60 hover:text-primary transition"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
        <div>
          <div className="text-sm font-semibold mb-3 text-foreground/90">Platform</div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/browse" className="hover:text-foreground">Marketplace</Link></li>
            <li><Link href="/ai-mart" className="hover:text-foreground">AI Mart</Link></li>
            <li><Link href="/vendors" className="hover:text-foreground">Verified Farmers</Link></li>
            <li><Link href="/vendor/list" className="hover:text-foreground">List a product</Link></li>
            <li><Link href="/onboarding" className="hover:text-foreground">Join the network</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-sm font-semibold mb-3 text-foreground/90">Onboarding</div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/onboarding?role=farmer" className="hover:text-foreground">Farmers</Link></li>
            <li><Link href="/onboarding?role=vendor" className="hover:text-foreground">Vendors</Link></li>
            <li><Link href="/onboarding?role=logistics" className="hover:text-foreground">Logistics partners</Link></li>
            <li><Link href="/onboarding?role=buyer" className="hover:text-foreground">Buyers</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 text-xs text-muted-foreground flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>© {new Date().getFullYear()} Agrillion Mart · Smart AG Mart</div>
          <div className="font-mono">v2.1 · admin-curated · ai-assisted</div>
        </div>
      </div>
    </footer>
  );
}
