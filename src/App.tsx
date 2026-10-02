import {
  AppRoot,
  Code,
  ExternalLink,
  type CommonQuestion,
  type DefaultPath,
  type NavConfig
} from "react-lib-tools";
import { repository } from "../package.json";
import Logo from "../public/favicon.svg?react";
import { html as refCompositionHTML } from "../public/generated/examples/RefComposition.json";
import { html as scrollingIndicatorHTML } from "../public/generated/examples/ScrollingIndicator.json";
import { Link } from "./components/Link";
import { routes, type Path } from "./routes";

export default function App() {
  return (
    <AppRoot
      commonQuestions={commonQuestions}
      enableSiteSearch
      nav={nav}
      packageDescription="render everything"
      packageLogo={<Logo className="rw-logo w-8 h-8" />}
      packageName="react-window"
      repositoryUrl={repository.url}
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

const nav: NavConfig<Path | DefaultPath> = [
  { path: "/", title: "Getting started" },
  { path: "/how-does-it-work", title: "How does it work?" },
  {
    title: "Lists",
    links: [
      { path: "/list/fixed-row-height", title: "Fixed row heights" },
      { path: "/list/variable-row-height", title: "Variable row heights" },
      { path: "/list/dynamic-row-height", title: "Dynamic row heights" },
      { path: "/list/scroll-to-row", title: "Scroll to row" },
      { path: "/list/aria-roles", title: "ARIA roles" },
      { path: "/list/props", title: "List props" },
      { path: "/list/imperative-handle", title: "Imperative handle" }
    ]
  },
  {
    title: "Tables",
    links: [
      { path: "/list/tabular-data", title: "Tabular data" },
      { path: "/list/tabular-data-aria-roles", title: "ARIA roles" }
    ]
  },
  {
    title: "Grids",
    links: [
      { path: "/grid/grid", title: "Rendering a grid" },
      { path: "/grid/scroll-to-cell", title: "Scroll to cells" },
      { path: "/grid/aria-roles", title: "ARIA roles" },
      { path: "/grid/props", title: "Grid props" },
      { path: "/grid/imperative-handle", title: "Imperative handle" }
    ]
  },
  {
    title: "Other",
    links: [
      { path: "/grid/rtl-grids", title: "Right to left content" },
      { path: "/grid/horizontal-lists", title: "Horizontal lists" },
      { path: "/list/images", title: "Images" },
      { path: "/list/sticky-rows", title: "Sticky rows" }
    ]
  },
  { path: "/platform-requirements", title: "Requirements" },
  { path: "/common-questions", title: "Common questions" },
  { path: "/support", title: "Support" }
];

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
  },
  {
    id: "grid-cell-auto-size",
    question: (
      <>
        Can <code>Grid</code> cells be auto-sized?
      </>
    ),
    answer: (
      <p>
        No. <code>Grid</code> cell sizes must be known ahead of time- either
        because they are static or because they can be derived (from the data in{" "}
        <code>CellProps</code>) without needing to be rendered.
      </p>
    )
  }
];

const VERSIONS = {
  "2.2.3": "https://react-window-9gegorjnr-brian-vaughns-projects.vercel.app",
  "2.1.2": "https://react-window-8cygyvomv-brian-vaughns-projects.vercel.app",
  "2.0.2": "https://react-window-btpcws98u-brian-vaughns-projects.vercel.app",
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
};
