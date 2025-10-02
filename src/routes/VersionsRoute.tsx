import { Fragment } from "react/jsx-runtime";
import { Box } from "../components/Box";
import { ExternalLink } from "../components/ExternalLink";
import { Header } from "../components/Header";
import TagsIcon from "../../public/svgs/tags.svg?react";

export default function VersionsRoute() {
  return (
    <Box direction="column" gap={2}>
      <Header title="Previous releases" />
      <div>Click below to view documentation for past releases.</div>
      {Object.entries(VERSIONS)
        .sort((a, b) => b[0].localeCompare(a[0]))
        .map(([major, minors]) => (
          <Fragment key={major}>
            <div className="text-lg">Version {major}</div>
            <ul className="pl-8">
              {Object.entries(minors)
                .sort((a, b) => b[0].localeCompare(a[0]))
                .map(([version, url]) => (
                  <VersionLink key={version} url={url} version={version} />
                ))}
            </ul>
          </Fragment>
        ))}
    </Box>
  );
}

const VERSIONS = {
  "2": {
    "2.2": "https://react-window-9gegorjnr-brian-vaughns-projects.vercel.app",
    "2.1": "https://react-window-8cygyvomv-brian-vaughns-projects.vercel.app",
    "2.0": "https://react-window-btpcws98u-brian-vaughns-projects.vercel.app"
  },
  "1": {
    "1.8": "https://react-window-v1.vercel.app",
    "1.7": "https://github.com/bvaughn/react-window/releases/tag/1.7.0",
    "1.6": "https://github.com/bvaughn/react-window/releases/tag/1.6.0",
    "1.5": "https://github.com/bvaughn/react-window/releases/tag/1.5.0",
    "1.4": "https://github.com/bvaughn/react-window/releases/tag/1.4.0",
    "1.3": "https://github.com/bvaughn/react-window/releases/tag/1.3.0",
    "1.2": "https://github.com/bvaughn/react-window/releases/tag/1.2.0",
    "1.1": "https://github.com/bvaughn/react-window/releases/tag/1.1.0",
    "1.0": "https://github.com/bvaughn/react-window/releases/tag/1.0.0"
  }
};

function VersionLink({ url, version }: { url: string; version: string }) {
  return (
    <li className="list-disc">
      <ExternalLink
        aria-label="Documentation for library version 1.x"
        href={url}
      >
        {version}
        <span className="text-teal-600">.x</span>
        {url.startsWith("https://github") && (
          <TagsIcon className="inline w-4 h-4 ml-1 text-slate-600" />
        )}
      </ExternalLink>
    </li>
  );
}
