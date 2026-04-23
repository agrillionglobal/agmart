import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Send, MessageCircle, Clock, CheckCircle2 } from "lucide-react";
import { AnimatedIcon } from "@/components/AnimatedIcon";
import { adminQueue } from "@/store/admin";

const SUPPORT_EMAIL = "support@agrillionmart.store";

const topics = [
  "General enquiry",
  "Vendor onboarding",
  "Buyer support",
  "Logistics partnership",
  "AI Mart / Quality control",
  "Press & partnerships",
];

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [topic, setTopic] = useState(topics[0]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget as HTMLFormElement);
    const name = String(fd.get("name") || "Anonymous");
    const email = String(fd.get("email") || "");
    const phone = String(fd.get("phone") || "");
    const message = String(fd.get("message") || "");
    adminQueue.add({
      type: "message",
      title: `${topic} — ${name}`,
      subtitle: email,
      data: { topic, name, email, phone, message },
    });
    setSubmitted(true);
    (e.currentTarget as HTMLFormElement).reset();
    setTimeout(() => setSubmitted(false), 6000);
  };

  return (
    <div className="relative">
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
      <div className="absolute -top-32 -left-20 h-96 w-96 rounded-full bg-primary/15 blur-3xl" />
      <div className="absolute top-40 -right-20 h-72 w-72 rounded-full bg-secondary/15 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border/60 bg-card/30 text-xs font-medium mb-5 text-muted-foreground">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-75 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            We typically respond within 24 hours
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.05]">
            <span className="text-foreground/90">Talk to the </span>
            <span className="neon-text">Agrillion team.</span>
          </h1>
          <p className="mt-5 text-foreground/70 text-lg max-w-2xl leading-relaxed">
            Whether you are a farmer ready to list, a buyer needing support, or a logistics
            partner — reach the right desk in minutes.
          </p>
        </motion.div>

        <div className="mt-12 grid lg:grid-cols-5 gap-8">
          {/* Contact info */}
          <div className="lg:col-span-2 space-y-4">
            <ContactCard
              icon={Mail}
              eyebrow="Email support"
              title={SUPPORT_EMAIL}
              hint="Best for detailed questions, attachments, vendor docs."
              href={`mailto:${SUPPORT_EMAIL}`}
              accent="primary"
            />
            <ContactCard
              icon={MessageCircle}
              eyebrow="Live chat"
              title="In-app assistant"
              hint="Open AI Mart copilot for quick answers on QC & inventory."
              href="/ai-mart"
              accent="accent"
            />
            <ContactCard
              icon={Phone}
              eyebrow="Phone (Mon–Sat)"
              title="+234 (0) 800 AGRILLION"
              hint="08:00 – 19:00 WAT · Multilingual desk"
              href="tel:+2348002474554"
              accent="secondary"
            />
            <ContactCard
              icon={MapPin}
              eyebrow="Head office"
              title="Abuja, Nigeria"
              hint="Hubs in Lagos, Kano, Port Harcourt & Enugu."
              accent="primary"
            />

            <div className="glass rounded-2xl p-5 mt-6">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground">
                <Clock className="h-3.5 w-3.5" /> Response SLA
              </div>
              <ul className="mt-3 space-y-2 text-sm text-foreground/80">
                <li className="flex items-center justify-between">
                  <span>Vendor onboarding</span>
                  <span className="font-mono text-primary">≤ 24h</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Buyer / order issues</span>
                  <span className="font-mono text-primary">≤ 4h</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Logistics dispute</span>
                  <span className="font-mono text-primary">≤ 12h</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            <form
              onSubmit={onSubmit}
              className="glass-strong rounded-3xl p-6 sm:p-8 space-y-5"
            >
              <div className="flex items-center gap-3 mb-2">
                <AnimatedIcon Icon={Send} accent="primary" />
                <div>
                  <div className="font-serif text-xl font-semibold">Send us a message</div>
                  <div className="text-xs text-muted-foreground">
                    Goes straight to{" "}
                    <a
                      href={`mailto:${SUPPORT_EMAIL}`}
                      className="text-primary hover:underline"
                    >
                      {SUPPORT_EMAIL}
                    </a>
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <Field name="name" label="Full name" placeholder="Adaeze Okafor" required />
                <Field
                  name="email"
                  label="Email"
                  type="email"
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field name="phone" label="Phone (optional)" placeholder="+234 …" />
                <div>
                  <label className="block text-xs font-mono uppercase tracking-[0.18em] text-muted-foreground mb-2">
                    Topic
                  </label>
                  <select
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full h-11 rounded-xl bg-card/60 border border-border/60 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
                  >
                    {topics.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-[0.18em] text-muted-foreground mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  required
                  rows={6}
                  placeholder="Tell us what you need help with…"
                  className="w-full rounded-xl bg-card/60 border border-border/60 px-3 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 resize-y"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="text-xs text-muted-foreground">
                  By sending, you agree to our admin-curated communication policy.
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full neon-bg text-primary-foreground font-semibold glow-primary transition"
                >
                  <Send className="h-4 w-4" />
                  Send message
                </button>
              </div>

              {submitted && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-3 rounded-2xl border border-primary/40 bg-primary/10 p-4"
                >
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                  <div className="text-sm">
                    <div className="font-semibold text-foreground">Message received.</div>
                    <div className="text-foreground/70">
                      Our {topic.toLowerCase()} desk will reply to you shortly. A copy has
                      been routed to{" "}
                      <span className="text-primary">{SUPPORT_EMAIL}</span>.
                    </div>
                  </div>
                </motion.div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  type = "text",
  placeholder,
  required,
  name,
}: {
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  name?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-mono uppercase tracking-[0.18em] text-muted-foreground mb-2">
        {label}
      </label>
      <input
        type={type}
        name={name}
        required={required}
        placeholder={placeholder}
        className="w-full h-11 rounded-xl bg-card/60 border border-border/60 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
      />
    </div>
  );
}

function ContactCard({
  icon: Icon,
  eyebrow,
  title,
  hint,
  href,
  accent,
}: {
  icon: typeof Mail;
  eyebrow: string;
  title: string;
  hint: string;
  href?: string;
  accent: "primary" | "secondary" | "accent";
}) {
  const ringMap = {
    primary: "text-primary ring-primary/30",
    secondary: "text-secondary ring-secondary/30",
    accent: "text-accent ring-accent/30",
  } as const;
  const Wrapper: React.ElementType = href ? "a" : "div";
  const props = href ? { href } : {};
  return (
    <Wrapper
      {...props}
      className="block glass rounded-2xl p-5 hover:border-primary/40 transition group"
    >
      <div className="flex items-start gap-4">
        <div
          className={`h-11 w-11 shrink-0 rounded-xl bg-card/60 border border-border/60 flex items-center justify-center ring-1 ${ringMap[accent]}`}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground font-mono">
            {eyebrow}
          </div>
          <div className="font-semibold text-foreground truncate group-hover:text-primary transition">
            {title}
          </div>
          <div className="text-xs text-muted-foreground mt-1 leading-relaxed">{hint}</div>
        </div>
      </div>
    </Wrapper>
  );
}
