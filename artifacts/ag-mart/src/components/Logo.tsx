import logo from "@/assets/logo.jpeg";

export function Logo({ size = 40, withText = true }: { size?: number; withText?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <img
        src={logo}
        alt="Agrillion Mart"
        width={size}
        height={size}
        className="rounded-full object-cover ring-2 ring-primary/20 shadow-sm"
        style={{ width: size, height: size }}
      />
      {withText && (
        <div className="leading-tight">
          <div className="font-serif text-xl font-bold gold-text tracking-wide">
            AGRILLION MART
          </div>
          <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            — AG MART —
          </div>
        </div>
      )}
    </div>
  );
}
