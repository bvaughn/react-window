import { cn } from "../../utils/cn";
import { Block } from "../Block";
import "./code-mirror.css";
import type { Language } from "./types";
import { useParser } from "./useParser";

export function Code({
  className = "",
  code,
  language = "JSX",
  title,
}: {
  className?: string;
  code: string;
  language?: Language;
  title?: string;
}) {
  const html = useParser({ code, language });

  const children = (
    <code
      className={cn(
        "text-xs md:text-sm block text-left whitespace-pre-wrap text-white! rounded-md p-3 bg-black",
        className,
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );

  if (title) {
    return (
      <Block className="py-2 flex flex-col gap-2">
        <code className="text-xs md:text-sm bg-neutral-900 text-neutral-600">
          {title}
        </code>
        {children}
      </Block>
    );
  }

  return children;
}
