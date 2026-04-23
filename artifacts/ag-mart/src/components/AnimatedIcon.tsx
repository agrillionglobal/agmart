import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

export function AnimatedIcon({
  Icon,
  accent = "primary",
  size = 48,
}: {
  Icon: LucideIcon;
  accent?: "primary" | "secondary" | "accent";
  size?: number;
}) {
  const ring: Record<string, string> = {
    primary: "from-primary/40 to-primary/10 ring-primary/30",
    secondary: "from-secondary/40 to-secondary/10 ring-secondary/30",
    accent: "from-accent/40 to-accent/10 ring-accent/30",
  };
  const text: Record<string, string> = {
    primary: "text-primary",
    secondary: "text-secondary",
    accent: "text-accent",
  };
  return (
    <motion.div
      whileHover={{ scale: 1.08, rotate: -4 }}
      transition={{ type: "spring", stiffness: 240, damping: 14 }}
      className={`relative inline-flex items-center justify-center rounded-2xl bg-gradient-to-br ring-1 ${ring[accent]}`}
      style={{ height: size, width: size }}
    >
      <div className="absolute inset-0 rounded-2xl border border-white/5" />
      <div
        className={`absolute -inset-1 rounded-2xl blur-md opacity-60 bg-gradient-to-br ${ring[accent].split(" ").slice(0, 2).join(" ")}`}
      />
      <Icon className={`relative ${text[accent]}`} style={{ height: size * 0.45, width: size * 0.45 }} />
    </motion.div>
  );
}
