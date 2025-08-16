import { Tab } from "@headlessui/react";
import { useState } from "react";
import { cn } from "../../utils/cn";
import { Box } from "../Box";
import { Code } from "./Code";

type Tab = "js" | "ts";

export function CodeTabs({
  className = "",
  codeJavaScript,
  codeTypeScript,
  title,
  transparent,
}: {
  className?: string;
  codeJavaScript: string;
  codeTypeScript: string;
  title?: string;
  transparent?: boolean;
}) {
  const [tab, setTab] = useState<Tab>("ts");

  return (
    <div className="relative">
      <Code
        className={className}
        code={tab === "ts" ? codeTypeScript : codeJavaScript}
        language={tab === "ts" ? "TSX" : "JSX"}
        title={title}
        transparent={transparent}
      />
      <Box className="absolute top-1 right-1" direction="column" gap={1}>
        <Button currentTab={tab} onChange={setTab} tab="ts" />
        <Button currentTab={tab} onChange={setTab} tab="js" />
      </Box>
    </div>
  );
}

function Button({
  currentTab,
  onChange,
  tab,
}: {
  currentTab: Tab;
  onChange: (tab: Tab) => void;
  tab: Tab;
}) {
  const isActive = currentTab === tab;
  return (
    <button
      className={cn(
        "p-1 w-5 h-5 flex items-center justify-center rounded-xs text-xs pt-1",
        {
          "bg-sky-400 text-black": isActive,
          "bg-white/20 hover:bg-white/30 cursor-pointer": !isActive,
        },
      )}
      onClick={() => onChange(tab)}
    >
      {tab.toUpperCase()}
    </button>
  );
}
