import type { PropsWithChildren } from "react";

export function ExternalLink({
  children,
  className,
  href,
  target = "_blank"
}: PropsWithChildren<{ className?: string; href: string; target?: string }>) {
  return (
    <a
      className={className}
      href={href}
      target={target}
      rel="noopener noreferrer"
    >
      {children}
    </a>
  );
}
