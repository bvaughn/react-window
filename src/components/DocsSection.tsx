import type { Section } from "../types";
import { Box } from "./Box";
import { Callout } from "./Callout";

export function DocsSection({
  className,
  sections
}: {
  className?: string;
  sections: Section[];
}) {
  return (
    <Box className={className} direction="column" gap={2}>
      {sections.map(({ content, intent }, index) => {
        if (intent) {
          return (
            <Callout key={index} html inline intent={intent} minimal>
              {content}
            </Callout>
          );
        }

        return (
          <div
            key={index}
            dangerouslySetInnerHTML={{
              __html: content
            }}
          ></div>
        );
      })}
    </Box>
  );
}
