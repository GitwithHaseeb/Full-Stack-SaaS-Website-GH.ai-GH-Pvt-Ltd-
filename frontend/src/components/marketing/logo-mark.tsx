import { cn } from "@/lib/utils";

/**
 * GH monogram. Use tone="navy" on Ivory backgrounds and tone="ivory" on Oxford Navy.
 * The source artwork is a raster trace of the JPEG master — see BRAND.md §4 rule 8.
 */
export function LogoMark({
  className = "",
  tone = "navy",
  size = 36,
}: {
  className?: string;
  tone?: "navy" | "ivory";
  size?: number;
}) {
  return (
    <img
      src={tone === "navy" ? "/brand/gh-mark-navy.png" : "/brand/gh-mark-ivory.png"}
      alt="GH Pvt Ltd"
      width={size}
      height={size}
      className={cn("object-contain", className)}
      style={{ width: size, height: size }}
    />
  );
}

/** Mark + "GH Pvt Ltd" wordmark in Playfair Display. Pair them on first contact (BRAND.md §4 rule 3). */
export function Wordmark({ tone = "navy", size = 36 }: { tone?: "navy" | "ivory"; size?: number }) {
  return (
    <span className="flex items-center gap-3">
      <LogoMark tone={tone} size={size} />
      <span
        className={cn(
          "font-display text-xl font-semibold leading-none",
          tone === "navy" ? "text-navy" : "text-ivory",
        )}
      >
        GH Pvt Ltd
      </span>
    </span>
  );
}
