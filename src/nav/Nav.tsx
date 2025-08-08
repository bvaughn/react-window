import { NavLink } from "./NavLink";
import { NavSection } from "./NavSection";

export function Nav() {
  return (
    <>
      <NavSection header="Simple List">
        <NavLink to="/simple-list/example">Example</NavLink>
        <NavLink to="/simple-list/props">Props</NavLink>
        <NavLink to="/simple-list/imperative-api">Imperative API</NavLink>
      </NavSection>
      <NavSection header="Dynamic List">
        <NavLink to="/dynamic-list/example">Example</NavLink>
        <NavLink to="/dynamic-list/props">Props</NavLink>
        <NavLink to="/dynamic-list/imperative-api">Imperative API</NavLink>
      </NavSection>
      <NavSection header="Simple Grid">
        <NavLink to="/simple-grid/example">Example</NavLink>
        <NavLink to="/simple-grid/props">Props</NavLink>
        <NavLink to="/simple-grid/imperative-api">Imperative API</NavLink>
      </NavSection>
      <NavSection header="Other">
        <NavLink to="/other/memoization">Memoization</NavLink>
      </NavSection>
    </>
  );
}
