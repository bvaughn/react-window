import type { PropsWithChildren } from "react";

export function Block({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={`border-lg bg-neutral-900 text-neutral-300 rounded-md p-2 ${className}`}
    >
      {children}
    </div>
  );
}
