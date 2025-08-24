import type { HTMLAttributes, PropsWithChildren } from "react";
import { ErrorBoundary } from "./ErrorBoundary";

export function Block({
  children,
  className,
  ...rest
}: PropsWithChildren<HTMLAttributes<HTMLDivElement> & { className?: string }>) {
  return (
    <ErrorBoundary>
      <div
        className={`border-lg bg-black/30 text-slate-300 rounded-lg p-2 ${className}`}
        {...rest}
      >
        {children}
      </div>
    </ErrorBoundary>
  );
}
