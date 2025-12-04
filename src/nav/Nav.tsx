import { NavLink } from "./NavLink";
import { NavSection } from "./NavSection";

export function Nav() {
  return (
    <div className="w-full shrink-0 flex flex-col gap-4 py-4 overflow-y-auto">
      <NavLink path="/">Getting started</NavLink>
      <NavSection label="Lists">
        <NavLink path="/list/fixed-row-height">Fixed row heights</NavLink>
        <NavLink path="/list/variable-row-height">Variable row heights</NavLink>
        <NavLink path="/list/dynamic-row-height">Dynamic row heights</NavLink>
        <NavLink path="/list/scroll-to-row">Scroll to row</NavLink>
        <NavLink path="/list/aria-roles">ARIA roles</NavLink>
        <NavLink path="/list/props">List props</NavLink>
        <NavLink path="/list/imperative-handle">Imperative handle</NavLink>
      </NavSection>
      <NavSection label="Tables">
        <NavLink path="/list/tabular-data">Tabular data</NavLink>
        <NavLink path="/list/tabular-data-aria-roles">ARIA roles</NavLink>
      </NavSection>
      <NavSection label="Grids">
        <NavLink path="/grid/grid">Rendering a grid</NavLink>
        <NavLink path="/grid/scroll-to-cell">Scroll to cells</NavLink>
        <NavLink path="/grid/aria-roles">ARIA roles</NavLink>
        <NavLink path="/grid/props">Grid props</NavLink>
        <NavLink path="/grid/imperative-handle">Imperative handle</NavLink>
      </NavSection>
      <NavSection label="Other">
        <NavLink path="/grid/rtl-grids">Right to left content</NavLink>
        <NavLink path="/grid/horizontal-lists">Horizontal lists</NavLink>
        <NavLink path="/list/images">Images</NavLink>
        <NavLink path="/list/sticky-rows">Sticky rows</NavLink>
      </NavSection>
      <div>
        <NavLink path="/platform-requirements">Requirements</NavLink>
        <NavLink path="/support">Support</NavLink>
      </div>
    </div>
  );
}
