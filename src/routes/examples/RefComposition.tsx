import { useCallback, type Ref } from "react";
import { List, type ListImperativeAPI, type ListProps } from "react-window";

declare const rest: ListProps<object>;

declare function useResizeObserver<Type>(): [Ref<Type>];

// <begin>

// eslint-disable-next-line react-hooks/rules-of-hooks
const [ref] = useResizeObserver<HTMLDivElement>();

// eslint-disable-next-line react-hooks/rules-of-hooks
const listRef = useCallback(
  (api: ListImperativeAPI) => {
    const element = api?.element ?? null;

    if (typeof ref === "function") {
      ref(element);
    } else if (typeof ref === "object" && ref !== null) {
      ref.current = element;
    }
  },
  [ref]
);

<List listRef={listRef} {...rest} />;

// <end>
