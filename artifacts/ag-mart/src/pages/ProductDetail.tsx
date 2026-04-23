import { Link, useParams, useLocation } from "wouter";
import { useState } from "react";
import { Minus, Plus, ShoppingCart, ShieldCheck, Truck, Star, ArrowLeft } from "lucide-react";
import { findProduct, findVendor, productsByCategory } from "@/data/catalog";
import { formatNaira, useCart } from "@/store/cart";
import { ProductCard } from "@/components/ProductCard";

export default function ProductDetail() {
  const params = useParams();
  const [, navigate] = useLocation();
  const product = findProduct(params.id ?? "");
  const { add } = useCart();
  const [qty, setQty] = useState(1);

  if (!product) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="font-serif text-2xl font-bold">Product not found</h1>
        <Link href="/browse" className="mt-4 inline-block text-primary hover:underline">
          ← Back to marketplace
        </Link>
      </div>
    );
  }

  const vendor = findVendor(product.vendorId);
  const related = productsByCategory(product.categoryId)
    .filter((p) => p.id !== product.id)
    .slice(0, 4);
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => window.history.back()}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="aspect-square bg-muted rounded-3xl overflow-hidden border">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        </div>

        <div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <Link href={`/browse?category=${product.categoryId}`} className="hover:text-primary">
              {product.categoryId}
            </Link>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold">{product.name}</h1>

          <div className="mt-3 flex items-center gap-4">
            <div className="flex items-center gap-1 text-sm">
              <Star className="h-4 w-4 fill-secondary text-secondary" />
              <span className="font-semibold">{product.rating}</span>
              <span className="text-muted-foreground">· {product.stock} in stock</span>
            </div>
            {vendor && (
              <Link href={`/vendor/${vendor.id}`} className="text-sm text-primary hover:underline">
                by {vendor.name} {vendor.verified && "✓"}
              </Link>
            )}
          </div>

          <div className="mt-6 flex items-baseline gap-3">
            <span className="text-4xl font-bold text-primary">{formatNaira(product.price)}</span>
            {product.originalPrice && (
              <>
                <span className="text-lg text-muted-foreground line-through">
                  {formatNaira(product.originalPrice)}
                </span>
                <span className="px-2 py-0.5 rounded-full gold-bg text-white text-xs font-bold">
                  Save {discount}%
                </span>
              </>
            )}
          </div>
          <div className="text-sm text-muted-foreground">per {product.unit}</div>

          <p className="mt-6 text-foreground/80 leading-relaxed">{product.description}</p>

          {product.tags && (
            <div className="mt-4 flex flex-wrap gap-2">
              {product.tags.map((t) => (
                <span key={t} className="px-2.5 py-1 rounded-full bg-muted text-xs">
                  #{t}
                </span>
              ))}
            </div>
          )}

          <div className="mt-8 flex items-center gap-4">
            <div className="inline-flex items-center border rounded-full bg-card">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="h-11 w-11 flex items-center justify-center hover:bg-muted rounded-l-full"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-12 text-center font-semibold">{qty}</span>
              <button
                onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                className="h-11 w-11 flex items-center justify-center hover:bg-muted rounded-r-full"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <button
              onClick={() => {
                add(product.id, qty);
                navigate("/cart");
              }}
              className="flex-1 inline-flex items-center justify-center gap-2 h-12 px-6 rounded-full bg-primary text-primary-foreground font-semibold hover:opacity-90 transition shadow-md"
            >
              <ShoppingCart className="h-5 w-5" /> Add {qty} to Cart ·{" "}
              {formatNaira(product.price * qty)}
            </button>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="flex items-center gap-3 p-3 border rounded-xl bg-card">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <div>
                <div className="text-xs font-semibold">Escrow Protected</div>
                <div className="text-[11px] text-muted-foreground">Funds held until delivery</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 border rounded-xl bg-card">
              <Truck className="h-5 w-5 text-primary" />
              <div>
                <div className="text-xs font-semibold">Fast Delivery</div>
                <div className="text-[11px] text-muted-foreground">2-5 business days</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="font-serif text-2xl font-bold mb-6">You may also like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
