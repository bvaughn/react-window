import type { AnchorHTMLAttributes } from "react";

export function ExternalLink({
  children,
  className,
  href,
  target = "_blank",
  ...rest
}: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      className={className}
      href={href}
      target={target}
      rel="noopener noreferrer"
      {...rest}
    >
      {children}
    </a>
  );
}
