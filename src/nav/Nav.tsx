import {
  ArrowTopRightOnSquareIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import { NavLink as NavLinkExternal } from "react-router-dom";
import { ExternalLink } from "../components/ExternalLink";
import { cn } from "../utils/cn";
import { NavLink } from "./NavLink";
import { NavSection } from "./NavSection";
import { useNavStore } from "../hooks/useNavStore";

export function Nav() {
  const { hide, visible } = useNavStore();

  return (
    <div
      className={cn(
        "absolute top-0 left-0 h-full z-40 md:relative w-full md:w-auto shrink-0 hidden md:flex",
        "flex-col gap-4 py-2 px-4 border-r border-r-neutral-800 bg-neutral-900 overflow-y-auto",
        {
          flex: visible,
        },
      )}
      onClick={hide}
    >
      <NavLinkExternal className="hidden md:block" to="/">
        react-window
      </NavLinkExternal>

      <button className="md:hidden absolute z-10 right-1 top-1 p-1">
        <XMarkIcon className="w-5 h-5 fill-current" />
      </button>

      <NavSection header="Simple List">
        <NavLink to="/simple-list/example">Example</NavLink>
        <NavLink to="/simple-list/props">Props</NavLink>
        <NavLink to="/simple-list/api">Imperative API</NavLink>
      </NavSection>
      <NavSection header="Dynamic List">
        <NavLink to="/dynamic-list/example">Example</NavLink>
        <NavLink to="/dynamic-list/props">Props</NavLink>
        <NavLink to="/dynamic-list/api">Imperative API</NavLink>
      </NavSection>
      <NavSection header="Simple Grid">
        <NavLink to="/simple-grid/example">Example</NavLink>
        <NavLink to="/simple-grid/props">Props</NavLink>
        <NavLink to="/simple-grid/api">Imperative API</NavLink>
      </NavSection>
      <NavSection header="Other">
        <NavLink to="/other/memoization">Memoization</NavLink>
        <li className="cursor-pointer text-sm pl-4 border-l border-l-neutral-800">
          <ExternalLink
            className="text-neutral-300! hover:text-white!"
            href="https://www.npmjs.com/package/react-window"
          >
            Installation{" "}
            <ArrowTopRightOnSquareIcon className="inline-block w-3 h-3 fill-neutral-500" />
          </ExternalLink>
        </li>
        <li className="cursor-pointer text-sm pl-4 border-l border-l-neutral-800">
          <ExternalLink
            className="text-neutral-300! hover:text-white!"
            href="https://github.com/bvaughn/react-window"
          >
            Support{" "}
            <ArrowTopRightOnSquareIcon className="inline-block w-3 h-3 fill-neutral-500" />
          </ExternalLink>
        </li>
      </NavSection>
    </div>
  );
}
