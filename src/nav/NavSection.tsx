import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel
} from "@headlessui/react";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import type { PropsWithChildren, ReactNode } from "react";
import { NavButton } from "./NavButton";

export function NavSection({
  children,
  label
}: PropsWithChildren<{ label: ReactNode }>) {
  return (
    <Disclosure as="section" defaultOpen={true}>
      <DisclosureButton className="w-full group border-none! data-focus:bg-white/10">
        <NavButton>
          <div className="uppercase text-sm font-bold text-white/50">
            {label}
          </div>
          <div className="grow" />
          <ChevronRightIcon className="size-4 fill-white/60 group-data-hover:fill-white/50 group-data-open:rotate-90" />
        </NavButton>
      </DisclosureButton>
      <DisclosurePanel className="pl-4">{children}</DisclosurePanel>
    </Disclosure>
  );
}
