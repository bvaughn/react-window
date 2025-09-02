import { ArrowTopRightOnSquareIcon } from "@heroicons/react/20/solid";
import type { ComponentDoc } from "react-docgen-typescript";
import { repository } from "../../../package.json";
import { Box } from "../Box";
import { ExternalLink } from "../ExternalLink";
import { Header } from "../Header";
import { PropsBlocks } from "./PropsBlocks";

export function ComponentProps({
  json,
  section
}: {
  json: ComponentDoc;
  section: string;
}) {
  return (
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
  );
}
