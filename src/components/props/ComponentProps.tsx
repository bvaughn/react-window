import { ArrowTopRightOnSquareIcon } from "@heroicons/react/20/solid";
import { repository } from "../../../package.json";
import type { ComponentMetadata } from "../../types";
import { Box } from "../Box";
import { ExternalLink } from "../ExternalLink";
import { Header } from "../Header";
import { ComponentPropsSection } from "./ComponentPropsSection";
import { useMemo } from "react";
import { processPropsJSON } from "../../utils/processPropsJSON";

export function ComponentProps({
  json,
  section
}: {
  json: ComponentMetadata;
  section: string;
}) {
  const { optionalProps, requiredProps } = useMemo(
    () => processPropsJSON(json),
    [json]
  );

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
      <ComponentPropsSection header="Required props" props={requiredProps} />
      <ComponentPropsSection header="Optional props" props={optionalProps} />
    </>
  );
}
