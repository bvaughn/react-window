export function EnvironmentMarker({ children }: { children: string }) {
  const comment =
    typeof window === "undefined"
      ? "<!-- SERVER MARKER -->"
      : "<!-- CLIENT MARKER -->";
  return (
    <div
      className="flex items-center gap-1 text-xs text-slate-300"
      dangerouslySetInnerHTML={{
        __html: `${comment} ${children}`
      }}
    />
  );
}
