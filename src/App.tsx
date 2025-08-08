import { BrowserRouter, Route, Routes } from "react-router-dom";
import GitHubIcon from "../public/svgs/github.svg?react";
import { ExternalLink } from "./components/ExternalLink";
import { Nav } from "./nav/Nav";
import { PageNotFound } from "./routes/PageNotFound";
import { SimpleListExampleRoute } from "./routes/simple-list/SimpleListExample";
import { SimpleListImperativeApiRoute } from "./routes/simple-list/SimpleListImperativeApi";
import { SimpleListPropsRoute } from "./routes/simple-list/SimpleListProps";

function App() {
  return (
    <BrowserRouter>
      <div className="h-full flex flex-row">
        <div className="w-45 shrink-0 h-full flex flex-col gap-4 py-2 px-4 border-r border-r-neutral-800 bg-neutral-900 overflow-y-auto">
          <div className="text-violet-400 text-xl flex flex-row justify-between items-center">
            <a href="/">react-window</a>
            <ExternalLink
              className="w-4 h-4"
              href="https://github.com/bvaughn/react-window"
            >
              <GitHubIcon className="w-4 h-4 text-neutral-600 hover:text-neutral-400" />
            </ExternalLink>
          </div>
          <Nav />
        </div>
        <div className="py-3 px-4 overflow-y-auto">
          <Routes>
            <Route path="*" element={<PageNotFound />} />
            <Route path="/" element={<SimpleListExampleRoute />} />
            <Route
              path="/simple-list/example"
              element={<SimpleListExampleRoute />}
            />
            <Route
              path="/simple-list/props"
              element={<SimpleListPropsRoute />}
            />
            <Route
              path="/simple-list/imperative-api"
              element={<SimpleListImperativeApiRoute />}
            />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
