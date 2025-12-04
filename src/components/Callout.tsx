import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
} from "@heroicons/react/20/solid";
import type { HTMLAttributes, PropsWithChildren } from "react";
import type { Intent } from "../types";
import { getIntentClassNames } from "../utils/getIntentClassNames";

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
      className={`${inline ? "w-fit" : "w-full"} rounded-md p-2 px-3 ${getIntentClassNames(intent, !!minimal)} ${className}`}
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
