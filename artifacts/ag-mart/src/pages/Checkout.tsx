import { useState } from "react";
import { useLocation } from "wouter";
import { ShieldCheck } from "lucide-react";
import { formatNaira, useCart } from "@/store/cart";

export default function Checkout() {
  const { detailedItems, subtotal, placeOrder } = useCart();
  const [, navigate] = useLocation();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [method, setMethod] = useState<"escrow" | "wallet" | "transfer">("escrow");
  const [submitting, setSubmitting] = useState(false);

  if (detailedItems.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h1 className="font-serif text-2xl font-bold">Nothing to checkout</h1>
        <button
          onClick={() => navigate("/browse")}
          className="mt-4 px-5 py-2.5 rounded-full bg-primary text-primary-foreground font-semibold"
        >
          Browse marketplace
        </button>
      </div>
    );
  }

  const total = subtotal + 1500;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      const order = placeOrder(`${name}, ${address}, ${city} (${phone})`);
      navigate(`/order-success?id=${order.id}`);
    }, 600);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="font-serif text-3xl font-bold mb-6">Checkout</h1>

      <form onSubmit={onSubmit} className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-card border rounded-2xl p-6">
            <h2 className="font-semibold text-lg mb-4">Delivery details</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Full name" required value={name} onChange={setName} />
              <Field label="Phone number" required value={phone} onChange={setPhone} type="tel" />
              <Field
                label="Delivery address"
                required
                value={address}
                onChange={setAddress}
                className="sm:col-span-2"
              />
              <Field label="City / Town" required value={city} onChange={setCity} />
              <Field label="Landmark (optional)" value="" onChange={() => {}} />
            </div>
          </section>

          <section className="bg-card border rounded-2xl p-6">
            <h2 className="font-semibold text-lg mb-4">Payment method</h2>
            <div className="space-y-2">
              {[
                { id: "escrow", t: "Escrow Pay", s: "Funds held until you confirm delivery", recommended: true },
                { id: "wallet", t: "AG Wallet", s: "Use your wallet balance" },
                { id: "transfer", t: "Bank Transfer", s: "Pay on next screen" },
              ].map((m) => (
                <label
                  key={m.id}
                  className={`flex items-start gap-3 p-4 border rounded-xl cursor-pointer transition ${
                    method === m.id ? "border-primary bg-primary/5" : "hover:bg-muted"
                  }`}
                >
                  <input
                    type="radio"
                    name="method"
                    checked={method === m.id}
                    onChange={() => setMethod(m.id as typeof method)}
                    className="mt-1 accent-primary"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="font-semibold">{m.t}</div>
                      {m.recommended && (
                        <span className="text-[10px] uppercase tracking-wide font-bold gold-bg text-white px-2 py-0.5 rounded-full">
                          Recommended
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">{m.s}</div>
                  </div>
                </label>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-primary" />
              All payments are protected by Agrillion Mart's buyer protection.
            </div>
          </section>
        </div>

        <aside className="bg-card border rounded-2xl p-5 h-fit lg:sticky lg:top-20">
          <h2 className="font-semibold text-lg mb-4">Your order</h2>
          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {detailedItems.map(({ product, quantity, lineTotal }) => (
              <div key={product.id} className="flex gap-3 text-sm">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-12 w-12 rounded-lg object-cover bg-muted"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{product.name}</div>
                  <div className="text-xs text-muted-foreground">× {quantity}</div>
                </div>
                <div className="font-semibold">{formatNaira(lineTotal)}</div>
              </div>
            ))}
          </div>
          <div className="border-t my-4" />
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatNaira(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Delivery</span>
              <span>{formatNaira(1500)}</span>
            </div>
            <div className="flex justify-between text-base pt-2 border-t mt-2">
              <span className="font-semibold">Total</span>
              <span className="font-bold text-primary">{formatNaira(total)}</span>
            </div>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="mt-5 w-full h-12 rounded-full bg-primary text-primary-foreground font-semibold hover:opacity-90 transition disabled:opacity-60"
          >
            {submitting ? "Placing order…" : `Pay ${formatNaira(total)}`}
          </button>
        </aside>
      </form>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  required,
  type = "text",
  className = "",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  type?: string;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="text-xs font-medium text-muted-foreground mb-1.5 block">
        {label} {required && <span className="text-destructive">*</span>}
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        type={type}
        className="w-full h-11 px-3 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
      />
    </label>
  );
}
