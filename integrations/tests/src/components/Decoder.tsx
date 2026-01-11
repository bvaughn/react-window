"use client";

import { useMemo } from "react";
import { Box } from "react-lib-tools";
import {} from "react-window";
import { decode } from "../utils/serializer/decode";

export function Decoder({
  encoded
}: {
  encoded: string;
  searchParams: URLSearchParams;
}) {
  // TODO const [state, setState] = useState(null);

  const children = useMemo(() => {
    if (!encoded) {
      return null;
    }

    return decode(encoded);
  }, [encoded]);

  // Debugging
  // console.group("Decoder");
  // console.log(encoded);
  // console.log(children);
  // console.groupEnd();

  return (
    <Box direction="column" gap={2}>
      <div>{children}</div>
      <Box className="p-2 overflow-auto" direction="row" gap={2} wrap>
        TODO
      </Box>
    </Box>
  );
}
