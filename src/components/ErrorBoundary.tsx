import type { PropsWithChildren } from "react";
import {
  ErrorBoundary as ErrorBoundaryExternal,
  type FallbackProps
} from "react-error-boundary";
import { Callout } from "./Callout";
import { Box } from "./Box";
import { Button } from "./Button";

export function ErrorBoundary({ children }: PropsWithChildren) {
  return (
    <ErrorBoundaryExternal FallbackComponent={FallbackComponent}>
      {children}
    </ErrorBoundaryExternal>
  );
}

function FallbackComponent({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <Callout intent="danger">
      <Box align="start" direction="column" gap={2}>
        <div className="font-bold">Something went wrong!</div>
        <pre className="text-sm font-monospace text-red-300">
          {error.message}
        </pre>
        <Button intent="danger" onClick={resetErrorBoundary}>
          Retry
        </Button>
      </Box>
    </Callout>
  );
}
