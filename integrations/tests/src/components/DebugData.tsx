import { cn } from "react-lib-tools";

export function DebugData({ data }: { data: object }) {
  return (
    <pre
      className={cn(
        "p-2 resize-none rounded-md font-mono text-xs",
        "border border-2 border-slate-800 focus:outline-none focus:border-sky-700"
      )}
    >
      <code className="text-xs">{JSON.stringify(data, replacer, 2)}</code>
    </pre>
  );
}

function replacer(_key: string, value: unknown) {
  if (typeof value === "number") {
    return Math.round(value);
  }

  return value;
}
