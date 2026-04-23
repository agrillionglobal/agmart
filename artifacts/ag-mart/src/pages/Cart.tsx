import { Link, useLocation } from "wouter";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { formatNaira, useCart } from "@/store/cart";

export default function Cart() {
  const { detailedItems, subtotal, setQty, remove } = useCart();
  const [, navigate] = useLocation();
  const delivery = detailedItems.length > 0 ? 1500 : 0;
  const total = subtotal + delivery;

  if (detailedItems.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <div className="mx-auto h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-4">
          <ShoppingBag className="h-9 w-9 text-muted-foreground" />
        </div>
        <h1 className="font-serif text-3xl font-bold">Your cart is empty</h1>
        <p className="mt-2 text-muted-foreground">
          Browse our farm-fresh marketplace and find something delicious.
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
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="font-serif text-3xl font-bold mb-6">Your Cart</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-3">
          {detailedItems.map(({ product, quantity, lineTotal }) => (
            <div
              key={product.id}
              className="flex gap-4 p-4 bg-card border rounded-2xl"
            >
              <Link
                href={`/product/${product.id}`}
                className="h-24 w-24 sm:h-28 sm:w-28 rounded-xl overflow-hidden bg-muted shrink-0"
              >
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              </Link>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between gap-3">
                  <Link href={`/product/${product.id}`} className="font-semibold hover:text-primary">
                    {product.name}
                  </Link>
                  <button
                    onClick={() => remove(product.id)}
                    className="text-muted-foreground hover:text-destructive p-1"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {formatNaira(product.price)} per {product.unit}
                </div>

                <div className="mt-3 flex items-center justify-between gap-3">
                  <div className="inline-flex items-center border rounded-full">
                    <button
                      onClick={() => setQty(product.id, quantity - 1)}
                      className="h-9 w-9 flex items-center justify-center hover:bg-muted rounded-l-full"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-10 text-center text-sm font-semibold">{quantity}</span>
                    <button
                      onClick={() => setQty(product.id, Math.min(product.stock, quantity + 1))}
                      className="h-9 w-9 flex items-center justify-center hover:bg-muted rounded-r-full"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="font-bold">{formatNaira(lineTotal)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <aside className="bg-card border rounded-2xl p-5 h-fit lg:sticky lg:top-20">
          <h2 className="font-semibold text-lg mb-4">Order Summary</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium">{formatNaira(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Delivery</span>
              <span className="font-medium">{formatNaira(delivery)}</span>
            </div>
            <div className="border-t my-3" />
            <div className="flex justify-between text-lg">
              <span className="font-semibold">Total</span>
              <span className="font-bold text-primary">{formatNaira(total)}</span>
            </div>
          </div>
          <button
            onClick={() => navigate("/checkout")}
            className="mt-5 w-full h-12 rounded-full bg-primary text-primary-foreground font-semibold hover:opacity-90 transition shadow"
          >
            Proceed to Checkout
          </button>
          <Link
            href="/browse"
            className="mt-3 block text-center text-sm text-muted-foreground hover:text-foreground"
          >
            Continue shopping
          </Link>
        </aside>
      </div>
    </div>
  );
}
