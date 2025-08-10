import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ScrollRestoration } from "./components/ScrollRestoration";
import { MobileHeader } from "./nav/MobileHeader";
import { Nav } from "./nav/Nav";
import { routeMap } from "./routes";

export default function App() {
  return (
    <BrowserRouter>
      <ScrollRestoration />
      <MobileHeader />
      <div className="pt-12 md:pt-0 h-full flex flex-row">
        <Nav />
        <main className="w-full py-3 px-4 overflow-y-auto">
          <Routes>
            {Object.entries(routeMap).map(([path, Component]) => (
              <Route Component={Component} key={path} path={path} />
            ))}
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
