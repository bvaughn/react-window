import type { ReactNode } from "react";

export function ExampleLayout({
  code,
  demo,
}: {
  code: ReactNode;
  demo: ReactNode;
}) {
  return (
    <div className="w-full flex flex-row flex-wrap justify-center md:justify-start gap-4 overflow-auto">
      <div className="w-full max-w-100 shrink-0">{demo}</div>
      <div className="w-full max-w-100 shrink-0">{code}</div>
    </div>
  );
}
