import type { PropsWithChildren } from "react";

export function NavSection({
  children,
  header,
}: PropsWithChildren<{ header: string }>) {
  return (
    <section>
      <div className="text-xs text-neutral-500 mb-2">{header}</div>
      <ul role="list">{children}</ul>
    </section>
  );
}
