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
  html = false,
  inline = false,
  intent = "none",
  minimal,
  ...rest
}: PropsWithChildren<
  HTMLAttributes<HTMLDivElement> & {
    className?: string;
    html?: boolean;
    inline?: boolean;
    intent?: Intent;
    minimal?: boolean;
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
      className={`${inline ? "w-fit" : "w-full"} rounded-md p-2 px-3 ${getClassNames(intent, !!minimal)} ${className}`}
      role="alert"
      {...rest}
    >
      <div className="flex flex-row gap-2">
        <Icon className="w-6 h-6 shrink-0" />
        {html ? (
          <div dangerouslySetInnerHTML={{ __html: children as string }} />
        ) : (
          <div>{children}</div>
        )}
      </div>
    </div>
  );
}

function getClassNames(intent: Intent, minimal: boolean) {
  switch (intent) {
    case "danger": {
      if (minimal) {
        return "bg-red-950 text-red-300 [&_svg]:text-red-500";
      }
      return "bg-black/10 bg-border border-2 border-red-500 text-white [&_svg]:text-red-500 [&_a]:text-red-400!";
    }
    case "none": {
      if (minimal) {
        return "bg-white/10 text-slate-300 [&_svg]:text-slate-400";
      }
      return "bg-black/10 bg-border border-2 border-white/40 text-white [&_svg]:text-white/60";
    }
    case "primary": {
      if (minimal) {
        return "bg-sky-950 text-sky-300 [&_svg]:text-sky-400";
      }
      return "bg-black/10 bg-border border-2 border-sky-400 text-white [&_svg]:text-sky-400";
    }
    case "success": {
      if (minimal) {
        return "bg-emerald-950 text-emerald-300 [&_svg]:text-emerald-400";
      }
      return "bg-black/10 bg-border border-2 border-emerald-400 text-white [&_svg]:text-emerald-400";
    }
    case "warning": {
      if (minimal) {
        return "bg-amber-950/65 text-amber-200 [&_svg]:text-amber-300";
      }
      return "bg-black/10 bg-border border-2 border-amber-400 text-white [&_svg]:text-amber-400 [&_a]:text-amber-400!";
    }
  }
}
