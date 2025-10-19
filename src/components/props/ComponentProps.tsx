import { ArrowTopRightOnSquareIcon } from "@heroicons/react/20/solid";
import { repository } from "../../../package.json";
import type { ComponentMetadata } from "../../types";
import { Box } from "../Box";
import { ExternalLink } from "../ExternalLink";
import { Header } from "../Header";
import { PropsBlocks } from "./PropsBlocks";

export function ComponentProps({
  json,
  section
}: {
  json: ComponentMetadata;
  section: string;
}) {
  return (
    <>
      <Box align="center" direction="row" gap={2} wrap>
        <Header section={section} title="Props and API" />
        <ExternalLink
          className="text-sm text-emerald-300 hover:text-white"
          href={`${repository.url.replace(".git", "")}/blob/master/${json.filePath}`}
        >
          <ArrowTopRightOnSquareIcon className="inline-block size-4 fill-current" />
        </ExternalLink>
      </Box>
      <PropsBlocks json={json} />
    </>
  );
}
