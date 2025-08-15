import { Box } from "../components/Box";
import { ExternalLink } from "../components/ExternalLink";
import { Link } from "../components/Link";

export function GettingStartedRoute() {
  return (
    <Box direction="column" gap={4}>
      <div>
        <strong>react-window</strong> is a component library that helps render
        large lists of data quickly (and without the performance problems that
        often go along with rendering a lot of data). It's used in a lot of
        places, from{" "}
        <ExternalLink href="https://chromewebstore.google.com/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en">
          React DevTools
        </ExternalLink>{" "}
        to the{" "}
        <ExternalLink href="https://github.com/replayio/devtools">
          Replace browser
        </ExternalLink>
        .
      </div>
      <div>
        This website has documentation and examples to help you get started with
        the library. Check out the <Link to="/support">Support</Link> page if
        you need help.
      </div>
      <div>Begin by installing the library from NPM:</div>
      <code className="grow text-xs md:text-sm block text-left whitespace-pre-wrap rounded-md p-3 bg-black text-white!">
        npm install <span className="tok-keyword">react-window</span>
      </code>
      <div>
        TypeScript definitions and component documentation are both included
        within the published <code>dist</code> folder.
      </div>
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
    </Box>
  );
}
