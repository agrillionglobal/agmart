import logo from "@/assets/logo.jpeg";

export function Logo({ size = 40, withText = true }: { size?: number; withText?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-primary/40 via-secondary/40 to-accent/40 blur-md opacity-70" />
        <img
          src={logo}
          alt="Agrillion Mart"
          width={size}
          height={size}
          className="relative rounded-full object-cover ring-1 ring-secondary/30 shadow-lg"
          style={{ width: size, height: size }}
        />
      </div>
      {withText && (
        <div className="leading-tight">
          <div className="font-serif text-base sm:text-lg font-semibold tracking-tight text-foreground">
            Agrillion <span className="gold-text">Mart</span>
          </div>
          <div className="text-[9px] uppercase tracking-[0.32em] text-muted-foreground/80 font-mono">
            smart ag mart
          </div>
        </div>
      )}
    </div>
  );
}
