import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck, CheckCircle2, XCircle, Trash2, Inbox, UserPlus,
  Store, Mail, Filter, Search, Lock, ArrowRight,
} from "lucide-react";
import { adminQueue, useAdminQueue, type QueueType, type Status, type AdminItem } from "@/store/admin";
import { formatNaira } from "@/store/cart";

const ADMIN_PASSCODE = "agrillion-admin";

const typeMeta: Record<QueueType, { label: string; Icon: typeof UserPlus; accent: string }> = {
  signup: { label: "Vendor / partner signups", Icon: UserPlus, accent: "text-primary" },
  listing: { label: "Product listings", Icon: Store, accent: "text-secondary" },
  message: { label: "Contact messages", Icon: Mail, accent: "text-accent" },
};

const tabs: { id: "all" | QueueType; label: string }[] = [
  { id: "all", label: "All" },
  { id: "signup", label: "Signups" },
  { id: "listing", label: "Listings" },
  { id: "message", label: "Messages" },
];

const statusFilters: { id: "pending" | "all" | Status; label: string }[] = [
  { id: "pending", label: "Pending" },
  { id: "approved", label: "Approved" },
  { id: "rejected", label: "Rejected" },
  { id: "all", label: "All statuses" },
];

export default function Admin() {
  const [authed, setAuthed] = useState(false);
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");

  if (!authed) {
    return (
      <div className="mx-auto max-w-md px-4 py-24">
        <div className="glass-strong rounded-3xl p-8 text-center">
          <div className="mx-auto h-14 w-14 rounded-full neon-bg flex items-center justify-center mb-4">
            <Lock className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="font-serif text-2xl font-semibold">Admin console</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Restricted area. Enter the admin passcode to continue.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (pass === ADMIN_PASSCODE) {
                setAuthed(true);
                setError("");
              } else {
                setError("Invalid passcode.");
              }
            }}
            className="mt-6 space-y-3"
          >
            <input
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              placeholder="Passcode"
              className="w-full h-11 rounded-xl bg-card/60 border border-border/60 px-3 text-sm text-center focus:outline-none focus:ring-1 focus:ring-primary/50"
            />
            {error && <div className="text-xs text-destructive">{error}</div>}
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full neon-bg text-primary-foreground font-semibold"
            >
              Enter <ArrowRight className="h-4 w-4" />
            </button>
            <div className="text-[11px] text-muted-foreground">
              Hint for demo: <span className="font-mono text-primary">agrillion-admin</span>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return <Console />;
}

function Console() {
  const items = useAdminQueue();
  const [tab, setTab] = useState<(typeof tabs)[number]["id"]>("all");
  const [statusTab, setStatusTab] = useState<(typeof statusFilters)[number]["id"]>("pending");
  const [q, setQ] = useState("");

  const counts = useMemo(() => {
    const c = { signup: 0, listing: 0, message: 0, pending: 0, approved: 0, rejected: 0 };
    for (const it of items) {
      c[it.type]++;
      c[it.status]++;
    }
    return c;
  }, [items]);

  const visible = useMemo(() => {
    return items.filter((it) => {
      if (tab !== "all" && it.type !== tab) return false;
      if (statusTab !== "all" && it.status !== statusTab) return false;
      if (q.trim()) {
        const hay = `${it.title} ${it.subtitle ?? ""} ${JSON.stringify(it.data)}`.toLowerCase();
        if (!hay.includes(q.toLowerCase())) return false;
      }
      return true;
    });
  }, [items, tab, statusTab, q]);

  return (
    <div className="relative">
      <div className="absolute inset-0 grid-bg opacity-25 pointer-events-none" />
      <div className="absolute -top-20 -left-20 h-80 w-80 rounded-full bg-primary/15 blur-3xl" />
      <div className="absolute top-40 -right-20 h-72 w-72 rounded-full bg-secondary/15 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/40 bg-primary/10 text-xs font-medium mb-3 text-primary">
              <ShieldCheck className="h-3.5 w-3.5" /> Admin console · restricted
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl font-semibold leading-tight">
              <span className="text-foreground/90">Review &amp; approve</span>
              <br />
              <span className="neon-text">everything before it goes live.</span>
            </h1>
          </div>
          <button
            onClick={() => adminQueue.clearReviewed()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border/60 text-sm hover:border-destructive/60 hover:text-destructive transition"
          >
            <Trash2 className="h-4 w-4" /> Clear reviewed
          </button>
        </div>

        <div className="grid sm:grid-cols-3 gap-3 mb-8">
          <Stat label="Pending review" value={counts.pending} accent="primary" Icon={Inbox} />
          <Stat label="Approved" value={counts.approved} accent="accent" Icon={CheckCircle2} />
          <Stat label="Rejected" value={counts.rejected} accent="secondary" Icon={XCircle} />
        </div>

        <div className="glass rounded-2xl p-3 sm:p-4 mb-6 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 rounded-full border border-border/60 bg-card/40 p-1">
            {tabs.map((t) => {
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition ${
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-1 rounded-full border border-border/60 bg-card/40 p-1">
            {statusFilters.map((s) => {
              const active = statusTab === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setStatusTab(s.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition flex items-center gap-1.5 ${
                    active
                      ? "bg-secondary text-secondary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Filter className="h-3 w-3" />
                  {s.label}
                </button>
              );
            })}
          </div>

          <div className="ml-auto relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search items…"
              className="w-full h-9 pl-9 pr-3 rounded-full border border-border/60 bg-card/40 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
            />
          </div>
        </div>

        {visible.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border/60 bg-card/20 p-16 text-center">
            <Inbox className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <div className="font-serif text-xl">All clear.</div>
            <p className="text-sm text-muted-foreground mt-1">
              No items match this filter right now.
            </p>
          </div>
        ) : (
          <div className="grid gap-3">
            <AnimatePresence initial={false}>
              {visible.map((it) => (
                <ItemRow key={it.id} item={it} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}

function ItemRow({ item }: { item: AdminItem }) {
  const meta = typeMeta[item.type];
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="glass-strong rounded-2xl p-5 grid lg:grid-cols-12 gap-4 items-start"
    >
      <div className="lg:col-span-5 flex items-start gap-3">
        <div
          className={`h-10 w-10 shrink-0 rounded-xl bg-card/60 border border-border/60 flex items-center justify-center ring-1 ring-primary/20 ${meta.accent}`}
        >
          <meta.Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground font-mono">
            {meta.label}
          </div>
          <div className="font-semibold text-foreground truncate">{item.title}</div>
          {item.subtitle && (
            <div className="text-xs text-muted-foreground truncate">{item.subtitle}</div>
          )}
          <div className="mt-2 flex items-center gap-2">
            <StatusPill status={item.status} />
            <span className="text-[10px] font-mono text-muted-foreground">
              {timeAgo(item.createdAt)}
            </span>
          </div>
        </div>
      </div>

      <div className="lg:col-span-5">
        <div className="rounded-xl border border-border/50 bg-background/40 p-3 text-xs">
          <div className="grid sm:grid-cols-2 gap-x-4 gap-y-1.5">
            {Object.entries(item.data).map(([k, v]) => (
              <div key={k} className="flex justify-between gap-3">
                <span className="text-muted-foreground capitalize truncate">
                  {k.replace(/([A-Z])/g, " $1")}
                </span>
                <span className="text-foreground/90 text-right truncate font-mono">
                  {formatValue(k, v)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="lg:col-span-2 flex lg:flex-col gap-2 lg:items-end">
        {item.status === "pending" ? (
          <>
            <button
              onClick={() => adminQueue.setStatus(item.id, "approved")}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full neon-bg text-primary-foreground text-xs font-semibold w-full justify-center"
            >
              <CheckCircle2 className="h-3.5 w-3.5" /> Approve
            </button>
            <button
              onClick={() => adminQueue.setStatus(item.id, "rejected")}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full border border-destructive/50 text-destructive text-xs font-semibold w-full justify-center hover:bg-destructive/10 transition"
            >
              <XCircle className="h-3.5 w-3.5" /> Reject
            </button>
          </>
        ) : (
          <button
            onClick={() => adminQueue.remove(item.id)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full border border-border/60 text-muted-foreground text-xs font-medium w-full justify-center hover:text-destructive hover:border-destructive/50 transition"
          >
            <Trash2 className="h-3.5 w-3.5" /> Remove
          </button>
        )}
      </div>
    </motion.div>
  );
}

function StatusPill({ status }: { status: Status }) {
  const map = {
    pending: "border-primary/40 text-primary bg-primary/10",
    approved: "border-accent/40 text-accent bg-accent/10",
    rejected: "border-destructive/40 text-destructive bg-destructive/10",
  } as const;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10px] uppercase font-mono tracking-wider ${map[status]}`}
    >
      {status}
    </span>
  );
}

function Stat({
  label, value, accent, Icon,
}: {
  label: string; value: number; accent: "primary" | "secondary" | "accent"; Icon: typeof Inbox;
}) {
  const map = {
    primary: "text-primary ring-primary/30",
    secondary: "text-secondary ring-secondary/30",
    accent: "text-accent ring-accent/30",
  } as const;
  return (
    <div className="glass rounded-2xl p-5 flex items-center gap-4">
      <div
        className={`h-12 w-12 rounded-xl bg-card/60 border border-border/60 flex items-center justify-center ring-1 ${map[accent]}`}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <div className="text-[10px] uppercase font-mono tracking-[0.22em] text-muted-foreground">
          {label}
        </div>
        <div className="font-serif text-3xl font-semibold">{value}</div>
      </div>
    </div>
  );
}

function formatValue(key: string, v: string | number | boolean | undefined) {
  if (v === undefined || v === "") return "—";
  if (typeof v === "boolean") return v ? "Yes" : "No";
  if (typeof v === "number") {
    if (/price|fee|spend|reserve|amount/i.test(key)) return formatNaira(v);
    return String(v);
  }
  return v.length > 60 ? v.slice(0, 60) + "…" : v;
}

function timeAgo(ts: number) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}
