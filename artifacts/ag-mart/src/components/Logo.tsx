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
          className="relative rounded-full object-cover ring-2 ring-secondary/40 shadow-lg"
          style={{ width: size, height: size }}
        />
      </div>
      {withText && (
        <div className="leading-tight">
          <div className="font-serif text-base sm:text-lg font-bold gold-text tracking-wide">
            AGRILLION MART
          </div>
          <div className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground">
            smart agri · ai
          </div>
        </div>
      )}
    </div>
  );
}
