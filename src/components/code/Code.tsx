import { cn } from "../../utils/cn";
import "./code-mirror.css";

export function Code({
  className = "",
  html
}: {
  className?: string;
  html: string;
}) {
  return (
    <div className="relative">
      <code
        className={cn(
          "text-sm md:text-base block text-left whitespace-pre-wrap break-normal text-white! rounded-md p-3 bg-black",
          "flex flex-col",
          className
        )}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
