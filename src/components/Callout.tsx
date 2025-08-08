import type { HTMLAttributes, PropsWithChildren } from "react";
import AlertIcon from "../../public/svgs/alert.svg?react";
import type { Intent } from "../types";

export function Callout({
  children,
  className,
  intent = "none",
  ...rest
}: PropsWithChildren<
  HTMLAttributes<HTMLDivElement> & {
    className?: string;
    intent?: Intent;
  }
>) {
  return (
    <div
      className={`rounded p-2 ${getClassNames(intent)} ${className}`}
      role="alert"
      {...rest}
    >
      <div className="flex flex-row gap-2">
        <AlertIcon className="w-6 h-6 shrink-0" />
        <div>{children}</div>
      </div>
    </div>
  );
}

function getClassNames(intent: Intent) {
  switch (intent) {
    case "danger": {
      return "bg-red-950 text-red-400 [&>div>svg]:text-red-200";
    }
    case "none": {
      return "bg-neutral-900 text-neutral-400 [&>div>svg]:text-neutral-300";
    }
    case "primary": {
      return "bg-blue-950 text-blue-500 [&>div>svg]:text-blue-200";
    }
    case "success": {
      return "bg-teal-950 text-teal-500 [&>div>svg]:text-teal-200";
    }
    case "warning": {
      return "bg-amber-900 text-amber-200 [&>div>svg]:text-amber-100";
    }
  }
}
