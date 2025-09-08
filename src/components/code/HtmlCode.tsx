import { Code } from "./Code";

type Markdown = {
  html: string;
};

export function HtmlCode({ markdown }: { markdown: Markdown }) {
  return (
    <Code html={markdown.html}>
      <div className="absolute top-2 right-2 text-xs select-none text-slate-600">
        HTML
      </div>
    </Code>
  );
}
