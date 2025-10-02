import { Fragment } from "react/jsx-runtime";
import { Box } from "../components/Box";
import { ExternalLink } from "../components/ExternalLink";
import { Header } from "../components/Header";
import GlobeIcon from "../../public/svgs/globe.svg?react";
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
            <div className="text-lg mt-2">Version {major}</div>
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
    "1.7": "",
    "1.6": "",
    "1.5": "",
    "1.4": "",
    "1.3": "",
    "1.2": "",
    "1.1": "",
    "1.0": ""
  }
};

function VersionLink({ url, version }: { url: string; version: string }) {
  return (
    <li className="list-disc">
      {version}
      <span className="text-slate-400">.x</span>
      {url && (
        <ExternalLink
          aria-label={`Documentation for version ${version}`}
          className="ml-4"
          href={url}
        >
          <GlobeIcon className="inline w-4 h-4 text-teal-200" /> documentation
        </ExternalLink>
      )}
      <ExternalLink
        aria-label={`GitHub tag for version ${version}`}
        className="ml-4"
        href={`https://github.com/bvaughn/react-window/releases/tag/${version}`}
      >
        <TagsIcon className="inline w-4 h-4 text-teal-200" /> source code
      </ExternalLink>
    </li>
  );
}
