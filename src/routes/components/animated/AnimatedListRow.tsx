import { cn, getIntentClassNames } from "react-lib-tools";

export function AnimatedListRow({
  children,
  rendered
}: {
  children?: string;
  rendered?: boolean;
}) {
  return (
    <div
      className={cn(
        "h-6 p-1 flex items-center rounded text-xs whitespace-nowrap transition-colors duration-150",
        rendered
          ? getIntentClassNames("primary")
          : "border-1 border-dashed border-white/10 text-white/20"
      )}
    >
      {children}
    </div>
  );
}
