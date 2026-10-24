import {
  Box,
  Header,
  HookSignature,
  HookSignatureItem,
  SectionHeader
} from "react-lib-tools";
import { Link } from "../../components/Link";

export default function UseVirtualizerRoute() {
  return (
    <Box direction="column" gap={4}>
      <Header
        section="Hooks"
        sourceCodePath="lib/components/virtualizer/useVirtualizer.ts"
        title="useVirtualizer"
      />
      <div>
        The <code>List</code> and <code>Grid</code> components render their own
        markup. To render custom markup instead (e.g. a{" "}
        <code>&lt;table&gt;</code>
        ), use the <code>useVirtualizer</code> hook. It calculates which items
        to render and where; how they are rendered is up to you.
      </div>
      <div>Click below for examples of how to use the hook.</div>
      <ul className="pl-8">
        <li className="list-disc">
          <Link to="/hooks/use-virtualizer/lists">Rendering a list</Link>
        </li>
        <li className="list-disc">
          <Link to="/hooks/use-virtualizer/tables">Rendering a table</Link>
        </li>
        <li className="list-disc">
          <Link to="/hooks/use-virtualizer/dynamic-heights">
            Rendering items with dynamic heights
          </Link>
        </li>
      </ul>
      <SectionHeader>Parameters</SectionHeader>
      <HookSignature>
        <HookSignatureItem name="count" type="number">
          Number of items.
        </HookSignatureItem>
        <HookSignatureItem
          defaultValue="0"
          name="defaultScrollOffset"
          optional
          type="number"
        >
          Initial scroll offset (in pixels), applied once when the element first
          mounts with at least one item. Ignored when a{" "}
          <code>scrollElement</code> is specified.
        </HookSignatureItem>
        <HookSignatureItem
          defaultValue="0"
          name="defaultSize"
          optional
          type="number"
        >
          Size (in pixels) of the viewport before it has been measured (e.g.
          during server rendering); this determines how many items are initially
          rendered.
        </HookSignatureItem>
        <HookSignatureItem name="dir" optional type='"ltr" | "rtl"'>
          Direction of horizontal content; detected from the element (or its
          ancestors) by default.
        </HookSignatureItem>
        <HookSignatureItem
          defaultValue='"vertical"'
          name="direction"
          optional
          type='"horizontal" | "vertical"'
        >
          Direction that items are laid out in.
        </HookSignatureItem>
        <HookSignatureItem name="element" type="HTMLElement | null">
          Element that scrolls the items or, if a <code>scrollElement</code> is
          specified, the element that contains the items. Item offsets are
          relative to the start of this element's content.
        </HookSignatureItem>
        <HookSignatureItem
          name="itemSize"
          type="number | string | ((index: number) => number) | DynamicRowHeight"
        >
          <p>Item size; the following formats are supported:</p>
          <ul className="pl-8">
            <li className="list-disc">number of pixels (number)</li>
            <li className="list-disc">
              percentage of the viewport's size (string)
            </li>
            <li className="list-disc">
              function that returns the item size (in pixels) given an index
            </li>
            <li className="list-disc">
              dynamic row height cache returned by the{" "}
              <code>useDynamicRowHeight</code> hook (vertical only); rendered
              items must be passed to <code>measureElement</code> and specify a{" "}
              <code>data-index</code> attribute
            </li>
          </ul>
          <p>
            Sizes are cached until the value of this option changes; memoize
            functions (e.g. with <code>useCallback</code>) and only change them
            when sizes change.
          </p>
        </HookSignatureItem>
        <HookSignatureItem
          name="onItemsRendered"
          optional
          type="(visibleItems: { startIndex: number; stopIndex: number }, allItems: { startIndex: number; stopIndex: number }) => void"
        >
          Callback notified when the range of visible (or rendered) items
          changes.
        </HookSignatureItem>
        <HookSignatureItem
          defaultValue="3"
          name="overscanCount"
          optional
          type="number"
        >
          How many additional items to render outside of the visible area.
        </HookSignatureItem>
        <HookSignatureItem
          name="scrollElement"
          optional
          type='"window" | HTMLElement | null'
        >
          Element that scrolls the items, for items that scroll along with other
          content (e.g. the page): <code>"window"</code> to scroll with the
          page, or an ancestor element that scrolls (<code>null</code> until it
          has mounted). See the{" "}
          <Link to="/list/scroll-element">scrolling with the page</Link> page
          for more information.
        </HookSignatureItem>
      </HookSignature>
      <SectionHeader>Return value</SectionHeader>
      <HookSignature>
        <HookSignatureItem
          name="items"
          type="{ index: number; offset: number; size: number }[]"
        >
          Items to render (including overscan). Offsets are relative to the
          start of the element's content; sizes are estimates for dynamic sizes
          that have not yet been measured.
        </HookSignatureItem>
        <HookSignatureItem
          name="measureElement"
          type="(element: Element | null) => void"
        >
          Ref callback for rendered items, required for items with dynamic sizes
          (see <code>itemSize</code>).
        </HookSignatureItem>
        <HookSignatureItem
          name="scrollToIndex"
          type="({ align, behavior, index }) => void"
        >
          Scrolls the element (or scroll element) so that the specified item is
          visible. Like the browser's <code>scrollIntoView</code>, items are
          aligned within the CSS <code>scroll-padding</code> of the element
          being scrolled (e.g. <code>scroll-padding-top</code> can leave room
          for a sticky header).
        </HookSignatureItem>
        <HookSignatureItem name="totalSize" type="number">
          Total size (in pixels) of all items; an estimate for dynamic sizes
          that have not yet been measured.
        </HookSignatureItem>
        <HookSignatureItem
          name="visibleRange"
          type="{ startIndex: number; stopIndex: number }"
        >
          Range of items within the visible area (excluding overscan).
        </HookSignatureItem>
      </HookSignature>
    </Box>
  );
}
