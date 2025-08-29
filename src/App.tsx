import {
  ArrowTopRightOnSquareIcon,
  Bars4Icon,
  XMarkIcon
} from "@heroicons/react/20/solid";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import GitHubIcon from "../public/svgs/github.svg?react";
import NpmHubIcon from "../public/svgs/npm.svg?react";
import { Box } from "./components/Box";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { ExternalLink } from "./components/ExternalLink";
import { Link } from "./components/Link";
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
          <Box align="center" direction="row" gap={4}>
            <Link
              children="react-window"
              className="text-xl text-white! text-shadow-black/20 text-shadow-sm font-bold"
              to="/"
            />
            <div className="hidden md:block text-black text-shadow-white/50 text-shadow-xs">
              render everything
            </div>
          </Box>
          <Box align="center" direction="row" gap={4}>
            <ExternalLink
              className="text-xs font-bold text-white! drop-shadow-black/20 drop-shadow-sm"
              href="https://react-window-v1.vercel.app/"
            >
              v1.x
            </ExternalLink>
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
                "bg-black/50 text-white": visible
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
        <div className="grow shrink flex flex-row shadow-lg mx-2 rounded-t-3xl overflow-hidden">
          <section
            className={cn(
              "w-full bg-black/90 md:block md:w-80 md:bg-black/80 overflow-auto",
              {
                hidden: !visible
              }
            )}
          >
            <Nav />
          </section>
          <main
            className={cn("w-full bg-black/90 relative overflow-auto", {
              hidden: visible
            })}
          >
            <div
              className="h-full p-4 py-4 overflow-auto [mask-image:linear-gradient(to_bottom,transparent,black_1.5rem)]"
              data-main-scrollable
            >
              <ErrorBoundary>
                <Routes>
                  {Object.entries(routeMap).map(([path, Component]) => (
                    <Route Component={Component} key={path} path={path} />
                  ))}
                </Routes>
              </ErrorBoundary>
            </div>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}
