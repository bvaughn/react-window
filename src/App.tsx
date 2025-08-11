import { Bars4Icon, XMarkIcon } from "@heroicons/react/20/solid";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import GitHubIcon from "../public/svgs/github.svg?react";
import NpmHubIcon from "../public/svgs/npm.svg?react";
import { Box } from "./components/Box";
import { ExternalLink } from "./components/ExternalLink";
import { RouteChangeHandler } from "./components/RouteChangeHandler";
import { useNavStore } from "./hooks/useNavStore";
import { Nav } from "./nav/Nav";
import { routeMap } from "./routes";
import { cn } from "./utils/cn";

export default function App() {
  const { toggle, visible } = useNavStore();

  return (
    <BrowserRouter>
      <RouteChangeHandler />

      <div className="h-full w-full max-w-350 mx-auto flex flex-col">
        <Box
          align="center"
          className="h-12 w-full p-4"
          direction="row"
          justify="between"
          gap={4}
        >
          <Link
            children="react-window"
            className="text-xl text-white! text-shadow-black/20 text-shadow-sm font-bold"
            to="/"
          />
          <Box align="center" direction="row" gap={4}>
            <ExternalLink
              className="text-white! drop-shadow-black/20 drop-shadow-sm"
              href="https://www.npmjs.com/package/react-window"
            >
              <NpmHubIcon className="w-8 h-8" />
            </ExternalLink>
            <ExternalLink
              className="text-white! drop-shadow-black/20 drop-shadow-sm"
              href="https://github.com/bvaughn/react-window"
            >
              <GitHubIcon className="w-6 h-6" />
            </ExternalLink>
            <button
              className={cn("block md:hidden cursor-pointer rounded-lg p-1", {
                "bg-black/40": !visible,
                "bg-black/50 text-white": visible,
              })}
              onClick={toggle}
            >
              {visible ? (
                <XMarkIcon className="w-6 h-6 fill-current drop-shadow-black/20 drop-shadow-xs" />
              ) : (
                <Bars4Icon className="w-6 h-6 fill-current drop-shadow-black/20 drop-shadow-xs" />
              )}
            </button>
          </Box>
        </Box>
        <div className="grow flex flex-row shadow-lg mx-2 rounded-t-3xl overflow-hidden">
          <section
            className={cn("w-full md:block md:w-60 bg-black/80 overflow-auto", {
              hidden: !visible,
            })}
          >
            <Nav />
          </section>
          <main
            className={cn("w-full p-4 bg-black/90 overflow-auto", {
              hidden: visible,
            })}
          >
            <Routes>
              {Object.entries(routeMap).map(([path, Component]) => (
                <Route Component={Component} key={path} path={path} />
              ))}
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}
