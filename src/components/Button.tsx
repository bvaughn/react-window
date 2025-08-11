import type { HTMLAttributes, PropsWithChildren } from "react";
import type { Intent } from "../types";
import { Button as HeadlessButton } from "@headlessui/react";

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
    <HeadlessButton
      className={`rounded-md font-bold cursor-pointer py-1 px-2 ${getClassNames(intent)} ${className}`}
      {...rest}
    >
      {children}
    </HeadlessButton>
  );
}

function getClassNames(intent: Intent) {
  switch (intent) {
    case "danger": {
      return "bg-red-400 hover:bg-red-500 text-red-800 hover:text-red-950 focus:text-black";
    }
    case "none": {
      return "bg-emerald-400 hover:bg-emerald-500 text-emerald-800 hover:text-emerald-950 focus:text-black";
    }
    case "success":
    case "primary": {
      return "bg-sky-400 hover:bg-sky-500 text-sky-800 hover:text-sky-950 focus:text-black";
    }
    case "warning": {
      return "bg-amber-400 hover:bg-amber-500 text-amber-800 hover:text-amber-950 focus:text-black";
    }
  }
}
