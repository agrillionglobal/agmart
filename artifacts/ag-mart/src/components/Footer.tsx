import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="mt-20 border-t bg-muted/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 grid gap-8 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo size={44} />
          <p className="mt-4 text-sm text-muted-foreground max-w-md">
            Agrillion Mart connects buyers directly with trusted farmers and vendors —
            farm gate prices, escrow-protected payments, and fast delivery across the country.
          </p>
        </div>
        <div>
          <div className="text-sm font-semibold mb-3">Marketplace</div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>Browse Produce</li>
            <li>Verified Vendors</li>
            <li>Bulk & Wholesale</li>
            <li>Farm Inputs</li>
          </ul>
        </div>
        <div>
          <div className="text-sm font-semibold mb-3">Company</div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>About Agrillion</li>
            <li>How It Works</li>
            <li>Trust & Safety</li>
            <li>Contact Support</li>
          </ul>
        </div>
      </div>
      <div className="border-t">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 text-xs text-muted-foreground flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>© {new Date().getFullYear()} Agrillion Mart. All rights reserved.</div>
          <div>Built for farmers, vendors, and conscious buyers.</div>
        </div>
      </div>
    </footer>
  );
}
