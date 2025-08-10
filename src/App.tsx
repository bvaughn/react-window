import { BrowserRouter, Route, Routes } from "react-router-dom";
import { MobileHeader } from "./nav/MobileHeader";
import { Nav } from "./nav/Nav";
import { PageNotFound } from "./routes/PageNotFound";
import { SimpleListExampleRoute } from "./routes/simple-list/SimpleListExample";
import { SimpleListImperativeApiRoute } from "./routes/simple-list/SimpleListImperativeApi";
import { SimpleListPropsRoute } from "./routes/simple-list/SimpleListProps";

function App() {
  return (
    <BrowserRouter>
      <MobileHeader />
      <div className="pt-10 md:pt-0 h-full flex flex-row">
        <Nav />
        <div className="w-full py-3 px-4 overflow-y-auto">
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
