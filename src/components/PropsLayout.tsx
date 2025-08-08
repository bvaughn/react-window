import type { ReactNode } from "react";

export function PropsLayout({ props }: { props: ReactNode }) {
  return <div className="flex flex-col gap-4 w-200 max-w-full">{props}</div>;
}
