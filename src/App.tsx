import {
  AppRoot,
  Code,
  ExternalLink,
  NavSection,
  type CommonQuestion
} from "react-lib-tools";
import { Link } from "./components/Link";
import { NavLink } from "./components/NavLink";
import { html as refCompositionHTML } from "../public/generated/examples/RefComposition.json";
import { html as scrollingIndicatorHTML } from "../public/generated/examples/ScrollingIndicator.json";
import { routes } from "./routes";

export default function App() {
  return (
    <AppRoot
      commonQuestions={commonQuestions}
      navLinks={
        <>
          <div>
            <NavLink path="/">Getting started</NavLink>
            <NavLink path="/how-does-it-work">How does it work?</NavLink>
          </div>
          <NavSection label="Lists">
            <NavLink path="/list/fixed-row-height">Fixed row heights</NavLink>
            <NavLink path="/list/variable-row-height">
              Variable row heights
            </NavLink>
            <NavLink path="/list/dynamic-row-height">
              Dynamic row heights
            </NavLink>
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
            <NavLink path="/common-questions">Common questions</NavLink>
            <NavLink path="/support">Support</NavLink>
          </div>
        </>
      }
      packageDescription="render everything"
      packageName="react-window"
      routes={routes}
      overview={
        <>
          <div>
            <strong>react-window</strong> is a component library that helps
            render large lists of data quickly and without the performance
            problems that often go along with rendering a lot of data. It's used
            in a lot of places, from{" "}
            <ExternalLink href="https://chromewebstore.google.com/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en">
              React DevTools
            </ExternalLink>{" "}
            to the{" "}
            <ExternalLink href="https://github.com/replayio/devtools">
              Replay browser
            </ExternalLink>
            .
          </div>
          <div>
            If you've never used a library like this before, you may want to
            read the <Link to="/how-does-it-work">how it works</Link> section
            first.
          </div>
        </>
      }
      versions={VERSIONS}
    />
  );
}

const commonQuestions: CommonQuestion[] = [
  {
    id: "scrolling-indicator",
    question: "Can I render a scrolling indicator?",
    answer: (
      <>
        <p>
          One way to implement a scrolling indicator would be to use a custom
          hook as shown below:
        </p>
        <Code html={scrollingIndicatorHTML} />
      </>
    )
  },
  {
    id: "ref-composition",
    question: (
      <>
        Can I attach a ref to the top-level <code>HTMLDivElement</code>?
      </>
    ),
    answer: (
      <>
        <p>
          Although there is no prop exposed to do this directly, you can use a
          callback ref for this.
        </p>
        <Code html={refCompositionHTML} />
      </>
    )
  }
];

const VERSIONS = {
  "2": {
    "2.2.3": "https://react-window-9gegorjnr-brian-vaughns-projects.vercel.app",
    "2.1.2": "https://react-window-8cygyvomv-brian-vaughns-projects.vercel.app",
    "2.0.2": "https://react-window-btpcws98u-brian-vaughns-projects.vercel.app"
  },
  "1": {
    "1.8.11":
      "https://web.archive.org/web/20241225003549/https://react-window.vercel.app/",
    "1.7.2": "",
    "1.6.2": "",
    "1.5.2": "",
    "1.4.0": "",
    "1.3.1": "",
    "1.2.4": "",
    "1.1.2": "",
    "1.0.3": ""
  }
};
