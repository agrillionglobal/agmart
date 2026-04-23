import { Logo } from "./Logo";
import { Github, Twitter, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-card/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo size={44} />
          <p className="mt-4 text-sm text-muted-foreground max-w-md">
            Agrillion Mart fuses AI, traceable supply chains, and direct-to-farm commerce
            into a single intelligent platform — built for the next generation of farmers,
            vendors, and conscious buyers.
          </p>
          <div className="mt-5 flex gap-2">
            {[Github, Twitter, Linkedin].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="h-9 w-9 rounded-full border border-border flex items-center justify-center hover:border-primary hover:text-primary transition"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
        <div>
          <div className="text-sm font-semibold mb-3 text-foreground/90">Platform</div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>Marketplace</li>
            <li>AI Lab</li>
            <li>Verified Farmers</li>
            <li>Bulk & Wholesale</li>
            <li>Farm Inputs</li>
          </ul>
        </div>
        <div>
          <div className="text-sm font-semibold mb-3 text-foreground/90">Company</div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>About Agrillion</li>
            <li>Smart Solutions</li>
            <li>Trust & Safety</li>
            <li>API & Developers</li>
            <li>Contact Support</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 text-xs text-muted-foreground flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>© {new Date().getFullYear()} Agrillion Mart · Smart Agri · AI</div>
          <div className="font-mono">v2.0 · powered by intelligence at the farm gate</div>
        </div>
      </div>
    </footer>
  );
}
