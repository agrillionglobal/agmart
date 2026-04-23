import { Link, useParams } from "wouter";
import { ArrowLeft, MapPin } from "lucide-react";
import { findVendor, productsByVendor } from "@/data/catalog";
import { ProductCard } from "@/components/ProductCard";

export default function VendorDetail() {
  const params = useParams();
  const vendor = findVendor(params.id ?? "");

  if (!vendor) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="font-serif text-2xl font-bold">Vendor not found</h1>
        <Link href="/vendors" className="mt-4 inline-block text-primary hover:underline">
          ← Back to vendors
        </Link>
      </div>
    );
  }

  const items = productsByVendor(vendor.id);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href="/vendors"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4" /> All vendors
      </Link>

      <div className="bg-card border rounded-2xl p-6 sm:p-8 leaf-bg text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(244,209,96,0.25),transparent_60%)]" />
        <div className="relative">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-3xl font-bold">{vendor.name}</h1>
                {vendor.verified && (
                  <span className="text-[10px] uppercase font-bold gold-bg text-white px-2 py-1 rounded-full">
                    Verified
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 text-sm mt-2 text-white/80">
                <MapPin className="h-4 w-4" /> {vendor.location}
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold gold-text">★ {vendor.rating}</div>
              <div className="text-xs text-white/70">{items.length} products listed</div>
            </div>
          </div>
          <p className="mt-4 text-white/90 max-w-2xl">{vendor.description}</p>
        </div>
      </div>

      <h2 className="mt-10 mb-4 font-serif text-2xl font-bold">Products from {vendor.name}</h2>
      {items.length === 0 ? (
        <div className="text-muted-foreground">No products listed yet.</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
