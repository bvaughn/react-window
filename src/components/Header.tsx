import { ChevronRightIcon } from "@heroicons/react/20/solid";
import { Box } from "./Box";
import { useEffect } from "react";

export function Header({
  section,
  title
}: {
  section?: string;
  title: string;
}) {
  useEffect(() => {
    const originalTitle = document.title;

    document.title = `react-window: ${section ? `${section}: ${title}` : title}`;

    return () => {
      document.title = originalTitle;
    };
  });

  return (
    <Box align="center" direction="row" gap={2} wrap>
      {section && (
        <>
          <div className="text-xl whitespace-nowrap">{section}</div>
          <ChevronRightIcon className="size-4 text-slate-400" />
        </>
      )}
      <div className="text-xl whitespace-nowrap">{title}</div>
    </Box>
  );
}
