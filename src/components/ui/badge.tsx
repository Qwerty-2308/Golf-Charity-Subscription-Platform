import { cn } from "@/lib/utils";

export function Badge({
  children,
  tone = "default",
  className,
}: {
  children: React.ReactNode;
  tone?: "default" | "success" | "warning" | "danger";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-[0.18em] uppercase",
        tone === "default" && "bg-white/80 text-muted",
        tone === "success" && "bg-success/12 text-success",
        tone === "warning" && "bg-accent/18 text-foreground",
        tone === "danger" && "bg-danger/12 text-danger",
        className,
      )}
    >
      {children}
    </span>
  );
}
