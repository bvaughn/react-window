import { useState } from "react";
import { cn } from "../../utils/cn";
import { Code } from "./Code";

export function CodeTabs({
  className = "",
  codeJavaScript,
  codeTypeScript,
  title,
}: {
  className?: string;
  codeJavaScript: string;
  codeTypeScript: string;
  title?: string;
}) {
  const [ts, setTS] = useState(true);

  return (
    <div className="relative">
      <Code
        className={className}
        code={ts ? codeTypeScript : codeJavaScript}
        language={ts ? "TSX" : "JSX"}
        title={title}
      />
      <button
        className={cn(
          "absolute top-2 right-2 p-1 rounded-sm bg-white/10 cursor-pointer hover:text-sky-300 hover:bg-sky-950 text-xs",
          {
            "text-white/50": !ts,
            "text-sky-300 bg-sky-950/50": ts,
          },
        )}
        onClick={() => setTS(!ts)}
      >
        TS
      </button>
    </div>
  );
}
