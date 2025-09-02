import { useTransition, type HTMLAttributes, type ReactNode } from "react";
import { useMatch, useNavigate } from "react-router-dom";
import type { Path } from "../routes";

type RenderFunction = (params: {
  isActive: boolean;
  isPending: boolean;
}) => ReactNode;

export function TransitionLink({
  children,
  onClick,
  to,
  ...rest
}: Omit<HTMLAttributes<HTMLSpanElement>, "children"> & {
  children?: ReactNode | RenderFunction;
  to: Path;
}) {
  const isActive = !!useMatch(to);
  const [isPending, startTransition] = useTransition();
  const navigate = useNavigate();

  return (
    <span
      children={
        typeof children === "function"
          ? children({ isActive, isPending })
          : children
      }
      data-link
      onClick={(event) => {
        onClick?.(event);

        startTransition(() => {
          navigate(to);
        });
      }}
      {...rest}
    />
  );
}
