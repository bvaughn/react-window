import { ArrowTopRightOnSquareIcon } from "@heroicons/react/20/solid";
import { type ComponentDoc } from "react-docgen-typescript";
import { repository } from "../../package.json";
import { ExternalLink } from "./ExternalLink";

export function ComponentHeader({ json }: { json: ComponentDoc }) {
  return (
    <div className="flex flex-row items-center gap-4">
      <div className="text-xl">{json.displayName}</div>
      <ExternalLink
        className="text-sm text-emerald-300 hover:text-white"
        href={`${repository.url.replace(".git", "")}/blob/master/${json.filePath}`}
      >
        View Source{" "}
        <ArrowTopRightOnSquareIcon className="inline-block w-3 h-3 fill-current" />
      </ExternalLink>
    </div>
  );
}
