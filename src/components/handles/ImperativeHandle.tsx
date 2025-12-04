import { ArrowTopRightOnSquareIcon } from "@heroicons/react/20/solid";
import { repository } from "../../../package.json";
import type { ImperativeHandleMetadata } from "../../types";
import { Box } from "../Box";
import { DocsSection } from "../DocsSection";
import { ExternalLink } from "../ExternalLink";
import { Header } from "../Header";
import { ImperativeHandleMethod } from "./ImperativeHandleMethod";

export function ImperativeHandle({
  json,
  section
}: {
  json: ImperativeHandleMetadata;
  section: string;
}) {
  return (
    <Box direction="column" gap={4}>
      <Box align="center" direction="row" gap={2} wrap>
        <Header section={section} title={`${json.name}`} />
        <ExternalLink
          className="text-sm text-emerald-300 hover:text-white"
          href={`${repository.url.replace(".git", "")}/blob/main/${json.filePath}`}
        >
          <ArrowTopRightOnSquareIcon className="inline-block size-4 fill-current" />
        </ExternalLink>
      </Box>
      <DocsSection sections={json.description} />
      <Box direction="column">
        <dl className="flex flex-col gap-2">
          {json.methods.map((method, index) => (
            <ImperativeHandleMethod key={index} method={method} />
          ))}
        </dl>
      </Box>
    </Box>
  );
}
