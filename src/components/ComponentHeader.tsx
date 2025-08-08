import { type ComponentDoc } from "react-docgen-typescript";
import { repository } from "../../package.json";
import Icon from "../../public/svgs/open-new.svg?react";
import { ExternalLink } from "./ExternalLink";

export function ComponentHeader({ json }: { json: ComponentDoc }) {
  return (
    <div className="flex flex-row items-center gap-4">
      <div>{json.displayName}</div>
      <ExternalLink
        className="text-xs"
        href={`${repository.url.replace(".git", "")}/blob/master/${json.filePath}`}
      >
        View Source <Icon className="inline-block w-3 h-3 fill-current" />
      </ExternalLink>
    </div>
  );
}
