import { cn } from "@/lib/utils";

/** Paragraph in blog body. Use for consistent spacing and color. */
export function BlogParagraph({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p className={cn("leading-relaxed text-black/65", className)}>{children}</p>
  );
}

/** H2 in blog body. */
export function BlogH2({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={cn(
        "text-xl font-semibold tracking-tight text-black/90",
        className
      )}
    >
      {children}
    </h2>
  );
}

/** Unordered list in blog body. */
export function BlogList({
  items,
  className,
}: {
  items: string[];
  className?: string;
}) {
  return (
    <ul
      className={cn(
        "list-disc space-y-2 pl-5 text-black/65 [&_li]:leading-relaxed",
        className
      )}
    >
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}
