import { Link } from "wouter";
import { CheckCircle2 } from "lucide-react";
import { useCart } from "@/store/cart";
import { formatNaira } from "@/store/cart";

export default function OrderSuccess() {
  const { orders } = useCart();
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const order = orders.find((o) => o.id === id) ?? orders[0];

  return (
    <div className="mx-auto max-w-xl px-4 py-16 text-center">
      <div className="mx-auto h-20 w-20 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
        <CheckCircle2 className="h-10 w-10" />
      </div>
      <h1 className="font-serif text-3xl font-bold">Order placed!</h1>
      <p className="text-muted-foreground mt-2">
        Thank you for shopping with Agrillion Mart. Your farmers are preparing your order now.
      </p>

      {order && (
        <div className="mt-8 bg-card border rounded-2xl p-6 text-left">
          <div className="flex justify-between items-baseline">
            <div>
              <div className="text-xs text-muted-foreground">Order ID</div>
              <div className="font-mono font-semibold">{order.id}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-muted-foreground">Total</div>
              <div className="font-bold text-primary">{formatNaira(order.total)}</div>
            </div>
          </div>
          <div className="mt-4 text-sm">
            <div className="text-xs text-muted-foreground mb-1">Delivering to</div>
            <div>{order.address}</div>
          </div>
          <div className="mt-4 inline-flex items-center gap-2 text-xs px-3 py-1 rounded-full bg-primary/10 text-primary font-semibold">
            ● {order.status}
          </div>
        </div>
      )}

      <div className="mt-8 flex gap-3 justify-center">
        <Link href="/orders" className="px-5 py-2.5 rounded-full border font-medium hover:bg-muted">
          View my orders
        </Link>
        <Link
          href="/browse"
          className="px-5 py-2.5 rounded-full bg-primary text-primary-foreground font-semibold"
        >
          Keep shopping
        </Link>
      </div>
    </div>
  );
}
