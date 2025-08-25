import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
} from "@heroicons/react/20/solid";
import type { HTMLAttributes, PropsWithChildren } from "react";
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
  let Icon = ExclamationTriangleIcon;
  switch (intent) {
    case "none":
    case "primary": {
      Icon = InformationCircleIcon;
      break;
    }
    case "success": {
      Icon = CheckCircleIcon;
      break;
    }
  }

  return (
    <div
      className={`w-fit rounded-md p-2 px-3 ${getClassNames(intent)} ${className}`}
      role="alert"
      {...rest}
    >
      <div className="flex flex-row gap-2">
        <Icon className="w-6 h-6 shrink-0" />
        <div>{children}</div>
      </div>
    </div>
  );
}

function getClassNames(intent: Intent) {
  switch (intent) {
    case "danger": {
      return "bg-black/10 bg-border border-2 border-red-400 text-white [&_svg]:text-red-400";
    }
    case "none": {
      return "bg-black/10 bg-border border-2 border-white/40 text-white [&_svg]:text-white/60";
    }
    case "primary": {
      return "bg-black/10 bg-border border-2 border-sky-400 text-white [&_svg]:text-sky-400";
    }
    case "success": {
      return "bg-black/10 bg-border border-2 border-emerald-400 text-white [&_svg]:text-emerald-400";
    }
    case "warning": {
      return "bg-black/10 bg-border border-2 border-amber-400 text-white [&_svg]:text-amber-400";
    }
  }
}
