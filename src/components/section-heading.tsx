import { Badge } from "@/components/ui/badge";

export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-2xl space-y-4">
      <Badge>{eyebrow}</Badge>
      <div className="space-y-3">
        <h2 className="display-font text-4xl leading-tight font-semibold text-foreground sm:text-5xl">
          {title}
        </h2>
        <p className="text-base leading-7 text-muted sm:text-lg">{description}</p>
      </div>
    </div>
  );
}
