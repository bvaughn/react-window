import useLocalStorage from "../../hooks/useLocalStorage";
import { cn } from "../../utils/cn";
import { Code } from "./Code";

type Markdown = {
  javaScript: string;
  typeScript: string;
};

export function TypeScriptCode({ markdown }: { markdown: Markdown }) {
  const [ts, setTS] = useLocalStorage("CodeTabs::tab", true);

  return (
    <Code html={ts ? markdown.typeScript : markdown.javaScript}>
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
    </Code>
  );
}
