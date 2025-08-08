import type { HTMLAttributes, PropsWithChildren } from "react";
import type { Intent } from "../types";

export function Button({
  children,
  className,
  intent = "none",
  ...rest
}: PropsWithChildren<
  HTMLAttributes<HTMLButtonElement> & {
    className?: string;
    intent?: Intent;
  }
>) {
  return (
    <button
      className={`rounded-sm text-sm font-bold cursor-pointer py-1 px-2 ${getClassNames(intent)} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

function getClassNames(intent: Intent) {
  switch (intent) {
    case "danger": {
      return "bg-red-200 hover:bg-red-300 text-red-600 hover:text-red-700";
    }
    case "none": {
      return "bg-neutral-300 hover:bg-neutral-400 text-neutral-600 hover:text-neutral-700";
    }
    case "primary": {
      return "bg-blue-200 hover:bg-blue-300 text-blue-600 hover:text-blue-700";
    }
    case "success": {
      return "bg-teal-200 hover:bg-teal-300 text-teal-600 hover:text-teal-700";
    }
    case "warning": {
      return "bg-amber-200 hover:bg-amber-300 text-amber-600 hover:text-amber-700";
    }
  }
}
