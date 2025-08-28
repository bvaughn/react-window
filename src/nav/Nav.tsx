import { NavLink } from "./NavLink";
import { NavSection } from "./NavSection";

export function Nav() {
  return (
    <div className="w-full shrink-0 flex flex-col gap-4 py-4 overflow-y-auto">
      <NavLink to="/">Getting started</NavLink>
      <NavSection label="Lists">
        <NavLink to="/list/fixed-row-height">Fixed row heights</NavLink>
        <NavLink to="/list/variable-row-height">Variable row heights</NavLink>
        <NavLink to="/list/props">Component props</NavLink>
        <NavLink to="/list/imperative-api">Imperative API</NavLink>
      </NavSection>
      <NavSection label="Grids">
        <NavLink to="/grid/grid">Rendering a grid</NavLink>
        <NavLink to="/grid/props">Component props</NavLink>
        <NavLink to="/grid/imperative-api">Imperative API</NavLink>
      </NavSection>
      <NavSection label="Other">
        <NavLink to="/list/tabular-data">Tabular data</NavLink>
        <NavLink to="/grid/rtl-grids">Right to left content</NavLink>
        <NavLink to="/grid/horizontal-lists">Horizontal lists</NavLink>
      </NavSection>
      <div>
        <NavLink to="/platform-requirements">Requirements</NavLink>
        <NavLink to="/support">Support</NavLink>
      </div>
    </div>
  );
}
