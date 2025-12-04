import Markdown from "markdown-it";

let processor: Markdown | undefined = undefined;

export function formatDescriptionText(text: string) {
  if (processor === undefined) {
    processor = new Markdown();
  }

  return processor.render(text);
}
