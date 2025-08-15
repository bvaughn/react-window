import { NavLink } from "./NavLink";
import { NavSection } from "./NavSection";

export function Nav() {
  return (
    <div className="w-full shrink-0 flex flex-col gap-4 py-4 overflow-y-auto">
      <NavLink to="/">Getting started</NavLink>
      <NavSection label="List">
        <NavLink to="/list/fixed-row-height">Overview</NavLink>
        <NavLink to="/list/fixed-row-height-props">Component props</NavLink>
        <NavLink to="/list/fixed-row-height-imperative-api">
          Imperative API
        </NavLink>
      </NavSection>
      <NavSection label="VariableList">
        <NavLink to="/list/variable-row-height">Overview</NavLink>
        <NavLink to="/list/variable-row-height-props">Component props</NavLink>
        <NavLink to="/list/variable-row-height-imperative-api">
          Imperative API
        </NavLink>
      </NavSection>
      <NavSection label="Grid">
        <NavLink to="/grid/grid">Overview</NavLink>
        <NavLink to="/grid/grid-props">Component props</NavLink>
        <NavLink to="/grid/grid-imperative-api">Imperative API</NavLink>
      </NavSection>
      <NavLink to="/support">Support</NavLink>
    </div>
  );
}
