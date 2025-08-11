import { Block } from "../Block";
import "./code-mirror.css";
import type { Language } from "./types";
import { useParser } from "./useParser";

export default function Code({
  className = "",
  code,
  language = "JSX",
  title,
  transparent = true,
}: {
  className?: string;
  code: string;
  language?: Language;
  title?: string;
  transparent?: boolean;
}) {
  const html = useParser({ code, language });

  const classNames = ["text-xs md:text-sm block text-left whitespace-pre-wrap"];
  if (!transparent) {
    classNames.push("rounded-md p-3 bg-black");
  }
  if (className) {
    classNames.push(className);
  }

  const children = (
    <code
      className={classNames.join(" ")}
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
