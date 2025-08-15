import { ArrowTopRightOnSquareIcon } from "@heroicons/react/20/solid";
import { ExternalLink } from "../components/ExternalLink";
import { NavButton } from "./NavButton";
import { NavLink } from "./NavLink";
import { NavSection } from "./NavSection";

export function Nav() {
  return (
    <div className="w-full shrink-0 flex flex-col gap-4 py-4 overflow-y-auto">
      <NavLink to="/">Getting started</NavLink>
      <NavSection label="List">
        <NavLink to="/list/fixed-row-height">Introduction</NavLink>
        <NavLink to="/list/fixed-row-height-props">Props</NavLink>
        <NavLink to="/list/fixed-row-height-imperative-api">
          Imperative API
        </NavLink>
      </NavSection>
      <NavSection label="VariableList">
        <NavLink to="/list/variable-row-height">Introduction</NavLink>
        <NavLink to="/list/variable-row-height-props">Props</NavLink>
        <NavLink to="/list/variable-row-height-imperative-api">
          Imperative API
        </NavLink>
      </NavSection>
      <NavSection label="Grid">
        <NavLink to="/grid/grid">Introduction</NavLink>
        <NavLink to="/grid/grid-props">Props</NavLink>
        <NavLink to="/grid/grid-imperative-api">Imperative API</NavLink>
      </NavSection>
      <NavSection label="Other">
        <NavLink to="/other/memoization">Memoization</NavLink>
        <NavButton>
          <ExternalLink
            className="text-inherit"
            href="https://www.npmjs.com/package/react-window"
          >
            Installation{" "}
            <ArrowTopRightOnSquareIcon className="inline-block size-4 text-white/50" />
          </ExternalLink>
        </NavButton>
        <NavButton>
          <ExternalLink
            className="text-inherit"
            href="https://github.com/bvaughn/react-window"
          >
            Support{" "}
            <ArrowTopRightOnSquareIcon className="inline-block size-4 text-white/50" />
          </ExternalLink>
        </NavButton>
      </NavSection>
    </div>
  );
}
