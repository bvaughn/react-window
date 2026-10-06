import { cn, getIntentClassNames } from "react-lib-tools";

export function AnimatedListColumn({
  children,
  rendered
}: {
  children?: string;
  rendered?: boolean;
}) {
  return (
    <div
      className={cn(
        "h-12 w-7 sm:w-14 shrink-0 p-1 flex items-center justify-center rounded text-xs whitespace-nowrap transition-colors duration-150",
        rendered
          ? getIntentClassNames("primary")
          : "border-1 border-dashed border-white/10 text-white/20"
      )}
    >
      {children}
    </div>
  );
}
