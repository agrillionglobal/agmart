import { Link } from "wouter";
import { vendors, productsByVendor } from "@/data/catalog";

export default function Vendors() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="font-serif text-3xl font-bold">Our Trusted Vendors</h1>
      <p className="mt-2 text-muted-foreground">
        Verified farmers, co-ops, and producers from across the country.
      </p>

      <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {vendors.map((v) => {
          const count = productsByVendor(v.id).length;
          return (
            <Link
              key={v.id}
              href={`/vendor/${v.id}`}
              className="block bg-card border rounded-2xl p-5 hover:shadow-md hover:border-primary/40 transition"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-semibold text-lg flex items-center gap-2">
                    {v.name}
                    {v.verified && (
                      <span className="text-[10px] uppercase font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                        Verified
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">{v.location}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-sm font-bold text-secondary">★ {v.rating}</div>
                  <div className="text-[11px] text-muted-foreground">{count} products</div>
                </div>
              </div>
              <p className="mt-3 text-sm text-muted-foreground line-clamp-3">{v.description}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
