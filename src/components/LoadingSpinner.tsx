import { ArrowPathIcon } from "@heroicons/react/20/solid";
import { Box } from "./Box";

export function LoadingSpinner() {
  return (
    <Box align="center" className="text-slate-300" direction="row" gap={2}>
      <ArrowPathIcon className="size-4 animate-spin" />
      Loading...
    </Box>
  );
}
