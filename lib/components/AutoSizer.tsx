import { CSSProperties, ReactNode, useState } from "react";
import { useResizeObserver } from "../hooks/useResizeObserver";

export function AutoSizer({
  children,
  className,
  defaultHeight,
  defaultWidth,
  style,
}: {
  children: (size: {
    height: number | undefined;
    width: number | undefined;
  }) => ReactNode;
  className?: string;
  defaultHeight?: number;
  defaultWidth?: number;
  style?: CSSProperties;
}) {
  const [element, setElement] = useState<HTMLDivElement | null>(null);

  const { height, width } = useResizeObserver({
    defaultHeight,
    defaultWidth,
    element,
  });

  return (
    <div className={className} ref={setElement} style={style}>
      {children({ height, width })}
    </div>
  );
}
