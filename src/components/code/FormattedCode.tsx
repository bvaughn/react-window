import { useJSONData } from "../../hooks/useJSONData";
import useLocalStorage from "../../hooks/useLocalStorage";
import { cn } from "../../utils/cn";
import { ErrorBoundary } from "../ErrorBoundary";
import { LoadingSpinner } from "../LoadingSpinner";
import { Code } from "./Code";

type Markdown = {
  javaScript: string;
  typeScript?: string;
};

export function FormattedCode({ url }: { url: string }) {
  return (
    <ErrorBoundary>
      <FormattedCodeLoader url={url} />
    </ErrorBoundary>
  );
}

export function FormattedCodeLoader({ url }: { url: string }) {
  const [ts, setTS] = useLocalStorage("CodeTabs::tab", true);

  const json = useJSONData<Markdown>(url);

  if (json === undefined) {
    return <LoadingSpinner />;
  }

  const code = (
    <Code html={ts ? (json.typeScript ?? json.javaScript) : json.javaScript} />
  );

  if (!json.typeScript) {
    return code;
  }

  return (
    <div className="relative">
      {code}
      <button
        className={cn(
          "absolute top-2 right-2 p-1 rounded-sm bg-white/10 cursor-pointer hover:text-sky-300 hover:bg-sky-950 text-xs flex flex-row items-center gap-1",
          {
            "text-white/50": !ts,
            "text-sky-300 bg-sky-950/50": ts
          }
        )}
        onClick={() => setTS(!ts)}
      >
        {ts ? "TS" : "JS"}
        <div
          className={cn("w-2 h-2 rounded", {
            "bg-green-400": ts,
            "bg-orange-400": !ts
          })}
        />
      </button>
    </div>
  );
}
