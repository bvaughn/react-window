import type { ReactNode } from "react";

export function ExampleLayout({
  code,
  demo,
}: {
  code: ReactNode;
  demo: ReactNode;
}) {
  return (
    <div className="flex flex-row flex-wrap gap-4 overflow-auto">
      <div className="min-w-100 max-w-full shrink-0">{demo}</div>
      <div className="min-w-100 max-w-full shrink-0">{code}</div>
    </div>
  );
}
