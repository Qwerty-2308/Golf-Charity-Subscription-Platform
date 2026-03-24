import { cn } from "@/lib/utils";

export function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("glass-panel ambient-border rounded-[2rem] p-6 sm:p-7", className)}>
      {children}
    </div>
  );
}
