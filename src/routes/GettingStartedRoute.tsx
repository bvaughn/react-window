import { Box } from "../components/Box";
import { Callout } from "../components/Callout";
import { ExternalLink } from "../components/ExternalLink";
import { Header } from "../components/Header";
import { Link } from "../components/Link";

export default function GettingStartedRoute() {
  return (
    <Box direction="column" gap={4}>
      <Header title="Getting started" />
      <div>
        <strong>react-window</strong> is a component library that helps render
        large lists of data quickly and without the performance problems that
        often go along with rendering a lot of data. It's used in a lot of
        places, from{" "}
        <ExternalLink href="https://chromewebstore.google.com/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en">
          React DevTools
        </ExternalLink>{" "}
        to the{" "}
        <ExternalLink href="https://github.com/replayio/devtools">
          Replay browser
        </ExternalLink>
        .
      </div>
      <div className="text-xl mt-4">Installation</div>
      <div>Begin by installing the library from NPM:</div>
      <code className="grow text-xs md:text-sm block text-left whitespace-pre-wrap rounded-md p-3 bg-black text-white!">
        npm install <span className="tok-keyword">react-window</span>
      </code>
      <Callout intent="primary">
        TypeScript definitions are included within the published{" "}
        <code>dist</code> folder and documentation is included within the{" "}
        <code>docs</code> folder.
      </Callout>
      <div className="text-xl mt-4">Learn more</div>
      <div>
        This library provides two basic types of components; choose one below to
        learn more:
      </div>
      <ul className="pl-8">
        <li className="list-disc">
          <Link to="/list/fixed-row-height">Lists</Link> (vertical scrolling)
        </li>
        <li className="list-disc">
          <Link to="/grid/grid">Grids</Link> (horizontal and vertical scrolling)
        </li>
      </ul>
      <div className="text-xl mt-4">Support</div>
      If you like this project there are several ways to support it:
      <ul className="pl-8">
        <li className="list-disc">
          <ExternalLink href="https://github.com/sponsors/bvaughn/">
            Become a GitHub sponsor
          </ExternalLink>
        </li>
        <li className="list-disc">
          <ExternalLink href="https://opencollective.com/react-window#sponsor">
            Become an Open Collective sponsor
          </ExternalLink>
        </li>
        <li className="list-disc">
          or{" "}
          <ExternalLink href="http://givebrian.coffee/">
            buy me a coffee
          </ExternalLink>
        </li>
      </ul>
    </Box>
  );
}
