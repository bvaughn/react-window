import {
  ArrowTopRightOnSquareIcon,
  ArrowTurnDownRightIcon,
} from "@heroicons/react/20/solid";
import { ExternalLink } from "../components/ExternalLink";
import { NavButton } from "./NavButton";
import { NavLink } from "./NavLink";
import { NavSection } from "./NavSection";

export function Nav() {
  return (
    <div className="w-full shrink-0 flex flex-col gap-4 py-4 overflow-y-auto">
      <NavLink to="/">Getting started</NavLink>
      <NavSection label="Lists">
        <NavLink to="/list/types">Types of lists</NavLink>
        <NavLink to="/list/fixed-row-heights">
          <ArrowTurnDownRightIcon className="size-3 ml-1 text-white/50" /> Fixed
          height
        </NavLink>
        <NavLink to="/list/variable-row-heights">
          <ArrowTurnDownRightIcon className="size-3 ml-1 text-white/50" />{" "}
          Variable height
        </NavLink>
        <NavLink to="/list/dynamic-row-heights">
          <ArrowTurnDownRightIcon className="size-3 ml-1 text-white/50" />{" "}
          Dynamic height
        </NavLink>
        <NavLink to="/list/props">Props</NavLink>
        <NavLink to="/list/api">Imperative API</NavLink>
      </NavSection>
      <NavSection label="Grids">
        <NavLink to="/grid/example">Example</NavLink>
        <NavLink to="/grid/props">Props</NavLink>
        <NavLink to="/grid/api">Imperative API</NavLink>
      </NavSection>
      <NavSection label="Other">
        <NavLink to="/other/memoization">Memoization</NavLink>
        <NavButton>
          <ExternalLink
            className="text-inherit"
            href="https://www.npmjs.com/package/react-window"
          >
            Installation{" "}
            <ArrowTopRightOnSquareIcon className="inline-block w-3 h-3 text-white/50" />
          </ExternalLink>
        </NavButton>
        <NavButton>
          <ExternalLink
            className="text-inherit"
            href="https://github.com/bvaughn/react-window"
          >
            Support{" "}
            <ArrowTopRightOnSquareIcon className="inline-block w-3 h-3 text-white/50" />
          </ExternalLink>
        </NavButton>
      </NavSection>
    </div>
  );
}
