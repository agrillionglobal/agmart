import { Link } from "wouter";
import { Star } from "lucide-react";
import { type Product, findVendor } from "@/data/catalog";
import { formatNaira } from "@/store/cart";

export function ProductCard({ product }: { product: Product }) {
  const vendor = findVendor(product.vendorId);
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <Link
      href={`/product/${product.id}`}
      className="group block glass rounded-2xl overflow-hidden hover:border-primary/50 hover:-translate-y-0.5 transition-all"
    >
      <div className="relative aspect-square bg-muted overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card/80 via-transparent to-transparent" />
        {discount > 0 && (
          <div className="absolute top-2 left-2 neon-bg text-primary-foreground text-[11px] font-bold px-2 py-1 rounded-full shadow">
            -{discount}%
          </div>
        )}
        {vendor?.verified && (
          <div className="absolute top-2 right-2 glass text-[10px] font-semibold px-2 py-1 rounded-full text-primary">
            ✓ Verified
          </div>
        )}
      </div>
      <div className="p-3 space-y-1.5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-sm leading-tight line-clamp-2">{product.name}</h3>
          <div className="flex items-center gap-0.5 text-xs shrink-0">
            <Star className="h-3 w-3 fill-secondary text-secondary" />
            <span className="font-medium">{product.rating}</span>
          </div>
        </div>
        <div className="text-xs text-muted-foreground line-clamp-1">{vendor?.name}</div>
        <div className="flex items-baseline gap-2 pt-1">
          <span className="font-bold text-base text-primary">{formatNaira(product.price)}</span>
          {product.originalPrice && (
            <span className="text-xs text-muted-foreground line-through">
              {formatNaira(product.originalPrice)}
            </span>
          )}
        </div>
        <div className="text-[11px] text-muted-foreground">per {product.unit}</div>
      </div>
    </Link>
  );
}
