import { Box } from "../components/Box";
import { ExternalLink } from "../components/ExternalLink";
import { Header } from "../components/Header";

export default function VersionsRoute() {
  return (
    <Box direction="column" gap={2}>
      <Header title="Previous releases" />
      <div>Click below to view documentation for past releases.</div>
      <div className="text-lg">Version 2</div>
      <ul className="pl-8">
        {Object.entries(VERSIONS).map(([version, url]) => (
          <VersionLink key={version} url={url} version={version} />
        ))}
      </ul>
      <div className="text-lg">Version 1</div>
      <ul className="pl-8">
        <VersionLink url="https://react-window-v1.vercel.app" version="1.8" />
      </ul>
    </Box>
  );
}

const VERSIONS = {
  "2.2": "https://react-window-9gegorjnr-brian-vaughns-projects.vercel.app",
  "2.1": "https://react-window-8cygyvomv-brian-vaughns-projects.vercel.app",
  "2.0": "https://react-window-btpcws98u-brian-vaughns-projects.vercel.app"
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
      </ExternalLink>
    </li>
  );
}
