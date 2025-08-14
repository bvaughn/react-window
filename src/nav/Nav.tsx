import {
  ArrowTopRightOnSquareIcon,
  CodeBracketIcon,
} from "@heroicons/react/20/solid";
import { Box } from "../components/Box";
import { ExternalLink } from "../components/ExternalLink";
import { NavButton } from "./NavButton";
import { NavLink } from "./NavLink";
import { NavSection } from "./NavSection";

export function Nav() {
  return (
    <div className="w-full shrink-0 flex flex-col gap-4 py-4 overflow-y-auto">
      <NavLink to="/">Getting started</NavLink>
      <NavSection label="Lists">
        <Box align="center" direction="row" gap={4} justify="between">
          <NavLink to="/list/fixed-row-height">Fixed height</NavLink>
          <NavLink to="/list/fixed-row-height-props">
            <small>
              <CodeBracketIcon className="inline-block size-4 text-white/50" />{" "}
              props
            </small>
          </NavLink>
        </Box>
        <Box align="center" direction="row" gap={4} justify="between">
          <NavLink to="/list/variable-row-height">Variable height</NavLink>
          <NavLink to="/list/variable-row-height-props">
            <small>
              <CodeBracketIcon className="inline-block size-4 text-white/50" />{" "}
              props
            </small>
          </NavLink>
        </Box>
        <NavLink to="/list/imperative-api">Imperative API</NavLink>
      </NavSection>
      <NavSection label="Grids">
        <Box align="center" direction="row" gap={4} justify="between">
          <NavLink to="/grid/grid">Grid</NavLink>
          <NavLink to="/grid/grid-props">
            <small>
              <CodeBracketIcon className="inline-block size-4 text-white/50" />{" "}
              props
            </small>
          </NavLink>
        </Box>
        <NavLink to="/grid/imperative-api">Imperative API</NavLink>
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
