import { Link } from "wouter";
import { Package } from "lucide-react";
import { findProduct } from "@/data/catalog";
import { formatNaira, useCart } from "@/store/cart";

export default function Orders() {
  const { orders } = useCart();

  if (orders.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <div className="mx-auto h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-4">
          <Package className="h-9 w-9 text-muted-foreground" />
        </div>
        <h1 className="font-serif text-3xl font-bold">No orders yet</h1>
        <p className="mt-2 text-muted-foreground">
          When you place an order it will show up here so you can track it.
        </p>
        <Link
          href="/browse"
          className="mt-6 inline-flex px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold"
        >
          Start shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="font-serif text-3xl font-bold mb-6">My Orders</h1>
      <div className="space-y-4">
        {orders.map((o) => (
          <div key={o.id} className="bg-card border rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b flex items-center justify-between flex-wrap gap-2">
              <div>
                <div className="text-xs text-muted-foreground">Order</div>
                <div className="font-mono font-semibold">{o.id}</div>
              </div>
              <div className="text-xs text-muted-foreground">
                {new Date(o.createdAt).toLocaleString()}
              </div>
              <div className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                ● {o.status}
              </div>
            </div>
            <div className="p-5 space-y-3">
              {o.items.map((it) => {
                const p = findProduct(it.productId);
                if (!p) return null;
                return (
                  <Link
                    key={it.productId}
                    href={`/product/${p.id}`}
                    className="flex gap-3 items-center hover:bg-muted/50 -mx-2 px-2 py-1.5 rounded-lg"
                  >
                    <img
                      src={p.image}
                      alt={p.name}
                      className="h-12 w-12 rounded-lg object-cover bg-muted"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{p.name}</div>
                      <div className="text-xs text-muted-foreground">× {it.quantity}</div>
                    </div>
                    <div className="font-semibold">{formatNaira(p.price * it.quantity)}</div>
                  </Link>
                );
              })}
            </div>
            <div className="px-5 py-4 border-t bg-muted/30 flex items-center justify-between">
              <div className="text-sm text-muted-foreground line-clamp-1 flex-1 pr-4">
                Delivering to: {o.address}
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Total</div>
                <div className="font-bold text-primary">{formatNaira(o.total)}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
