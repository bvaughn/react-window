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

    switch (typeof ref) {
      case "function": {
        ref(element);
        break;
      }
      case "object": {
        if (ref !== null) {
          ref.current = element;
        }
        break;
      }
    }
  },
  [ref]
);

<List listRef={listRef} {...rest} />;

// <end>
