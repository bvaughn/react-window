import type { HTMLAttributes, PropsWithChildren } from "react";

export function Block({
  children,
  className,
  ...rest
}: PropsWithChildren<HTMLAttributes<HTMLDivElement> & { className?: string }>) {
  return (
    <div
      className={`border-lg bg-black/30 text-neutral-300 rounded-lg p-2 ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}
