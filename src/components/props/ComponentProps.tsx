import { ArrowTopRightOnSquareIcon } from "@heroicons/react/20/solid";
import type { ComponentDoc } from "react-docgen-typescript";
import { repository } from "../../../package.json";
import { useJSONData } from "../../hooks/useJSONData";
import { Box } from "../Box";
import { ErrorBoundary } from "../ErrorBoundary";
import { ExternalLink } from "../ExternalLink";
import { Header } from "../Header";
import { LoadingSpinner } from "../LoadingSpinner";
import { PropsBlocks } from "./PropsBlocks";

export function ComponentProps({
  section,
  url
}: {
  section: string;
  url: string;
}) {
  return (
    <ErrorBoundary>
      <ComponentPropsLoader section={section} url={url} />
    </ErrorBoundary>
  );
}

function ComponentPropsLoader({
  section,
  url
}: {
  section: string;
  url: string;
}) {
  const json = useJSONData<ComponentDoc>(url);

  return json ? (
    <>
      <Box align="center" direction="row" gap={2} wrap>
        <Header section={section} title="Component props" />
        <ExternalLink
          className="text-sm text-emerald-300 hover:text-white"
          href={`${repository.url.replace(".git", "")}/blob/master/${json.filePath}`}
        >
          <ArrowTopRightOnSquareIcon className="inline-block size-4 fill-current" />
        </ExternalLink>
      </Box>
      <PropsBlocks json={json} />
    </>
  ) : (
    <>
      <Header section={section} title="Component props" />
      <LoadingSpinner />
    </>
  );
}
