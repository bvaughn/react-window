import {
  Box,
  Callout,
  Header,
  HookSignature,
  HookSignatureItem,
  SectionHeader
} from "react-lib-tools";
import { Link } from "../../components/Link";

export default function UseIsScrollingRoute() {
  return (
    <Box direction="column" gap={4}>
      <Header
        section="Hooks"
        sourceCodePath="lib/hooks/useIsScrolling.ts"
        title="useIsScrolling"
      />
      <div>
        The <code>useIsScrolling</code> hook tracks whether a list (or grid) is
        scrolling. Rows can use this value to render simplified content while
        scrolling, in place of content that is expensive to render.
      </div>
      <div>Click below for examples of how to use the hook.</div>
      <ul className="pl-8">
        <li className="list-disc">
          <Link to="/hooks/use-is-scrolling/scrolling-a-list">
            Scrolling a list
          </Link>
        </li>
        <li className="list-disc">
          <Link to="/hooks/use-is-scrolling/scrolling-with-the-window">
            Scrolling with the window
          </Link>
        </li>
      </ul>
      <SectionHeader>Parameters</SectionHeader>
      <HookSignature>
        <HookSignatureItem
          name="target"
          type='"window" | HTMLElement | null | undefined'
        >
          <p>The element that scrolls:</p>
          <ul className="pl-8">
            <li className="list-disc">
              a list or grid's own element (e.g. from{" "}
              <code>useListCallbackRef</code>)
            </li>
            <li className="list-disc">
              <code>"window"</code> or the scroll element, for lists and grids
              that use the <code>scrollElement</code> prop
            </li>
          </ul>
        </HookSignatureItem>
        <HookSignatureItem
          defaultValue="{}"
          name="options"
          optional
          type="{ delay?: number }"
        >
          <p>
            <code>delay</code>: milliseconds without scroll events after which
            scrolling is considered to have ended; defaults to 150.
          </p>
          <Callout intent="primary">
            Scrolling ends when the browser fires a <code>scrollend</code>{" "}
            event. The <code>delay</code> is only used by browsers that don't
            support that event.
          </Callout>
        </HookSignatureItem>
      </HookSignature>
      <SectionHeader>Return value</SectionHeader>
      <HookSignature>
        <HookSignatureItem name="isScrolling" type="boolean">
          Whether the target is currently scrolling.
        </HookSignatureItem>
      </HookSignature>
      <Callout intent="primary">
        Scrolling that starts and ends before React renders (e.g. an instant
        scroll) may not change this value.
      </Callout>
      <Callout intent="warning">
        Changing this value re-renders any rows it is passed to (e.g. via{" "}
        <code>rowProps</code>) when scrolling starts and when it ends.
      </Callout>
    </Box>
  );
}
