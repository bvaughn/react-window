import type { HTMLAttributes, PropsWithChildren } from "react";
import type { Intent } from "../types";
import { Button as HeadlessButton } from "@headlessui/react";
import { cn } from "../utils/cn";

export function Button({
  children,
  className,
  disabled,
  intent = "none",
  ...rest
}: PropsWithChildren<
  HTMLAttributes<HTMLButtonElement> & {
    className?: string;
    disabled?: boolean;
    intent?: Intent;
  }
>) {
  return (
    <HeadlessButton
      className={cn(
        "rounded-md font-bold cursor-pointer px-2",
        getClassNames(intent, !!disabled),
        {
          "opacity-50 cursor-default": disabled
        },
        className
      )}
      data-focus
      disabled={disabled}
      {...rest}
    >
      {children}
    </HeadlessButton>
  );
}

function getClassNames(intent: Intent, disabled: boolean) {
  switch (intent) {
    case "danger": {
      return cn("bg-red-400 text-red-800 focus:text-black", {
        "hover:bg-red-500 hover:text-red-950 focus:text-black": !disabled
      });
    }
    case "none": {
      return cn("bg-emerald-400 text-emerald-800 focus:text-black", {
        "hover:bg-emerald-500 hover:text-emerald-950 focus:text-black":
          !disabled
      });
    }
    case "success":
    case "primary": {
      return cn("bg-sky-400 text-sky-800 focus:text-black", {
        "hover:bg-sky-500 hover:text-sky-950 focus:text-black": !disabled
      });
    }
    case "warning": {
      return cn("bg-amber-400 text-amber-800 focus:text-black", {
        "hover:bg-amber-500 hover:text-amber-950 focus:text-black": !disabled
      });
    }
  }
}
