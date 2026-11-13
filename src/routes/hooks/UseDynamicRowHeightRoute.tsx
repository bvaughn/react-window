import {
  Box,
  Callout,
  Header,
  HookSignature,
  HookSignatureItem,
  SectionHeader
} from "react-lib-tools";
import { Link } from "../../components/Link";

export default function UseDynamicRowHeightRoute() {
  return (
    <Box direction="column" gap={4}>
      <Header
        section="Hooks"
        sourceCodePath="lib/components/list/useDynamicRowHeight.ts"
        title="useDynamicRowHeight"
      />
      <div>
        The <code>useDynamicRowHeight</code> hook creates a cache of measured
        row heights, for lists whose rows can't be sized until they've been
        rendered (e.g. a chat log with messages of varying length). Pass the
        returned value as the <code>rowHeight</code> prop of <code>List</code>{" "}
        (or the <code>itemSize</code> option of <code>useVirtualizer</code>) and
        rendered rows will be measured automatically.
      </div>
      <div>Click below for examples of how to use the hook.</div>
      <ul className="pl-8">
        <li className="list-disc">
          <Link to="/list/dynamic-row-height">With a list</Link>
        </li>
        <li className="list-disc">
          <Link to="/hooks/use-virtualizer/dynamic-heights">
            With <code>useVirtualizer</code>
          </Link>
        </li>
        <li className="list-disc">
          <Link to="/server-rendering/dynamic-row-heights">
            With server rendering
          </Link>
        </li>
      </ul>
      <SectionHeader>Parameters</SectionHeader>
      <HookSignature>
        <HookSignatureItem name="defaultRowHeight" type="number">
          Estimated height (in pixels) of rows that have not yet been measured.
        </HookSignatureItem>
        <HookSignatureItem
          name="initialRowHeights"
          optional
          type="ReadonlyMap<number, number> | readonly number[]"
        >
          <p>
            Row heights (in pixels) that are known or can be estimated ahead of
            time; either an array (indexed by row) or a <code>Map</code> of row
            index to height. These are used in place of{" "}
            <code>defaultRowHeight</code> until rows are measured, which can
            make server-rendered lists and initial scroll positions more
            accurate.
          </p>
          <Callout intent="primary">
            This value is only read when the hook first mounts and when the{" "}
            <code>key</code> changes.
          </Callout>
        </HookSignatureItem>
        <HookSignatureItem name="key" optional type="string | number">
          Changing this value clears all measured row heights, e.g. when the
          list renders a different set of data.
        </HookSignatureItem>
      </HookSignature>
      <SectionHeader>Return value</SectionHeader>
      <HookSignature>
        <HookSignatureItem name="rowHeight" type="DynamicRowHeight">
          <p>
            Row height cache to pass to <code>List</code> or{" "}
            <code>useVirtualizer</code>. Most apps don't need to call its
            methods directly:
          </p>
          <ul className="pl-8">
            <li className="list-disc">
              <code>getAverageRowHeight()</code>: average height of measured
              rows (or <code>defaultRowHeight</code> if none have been measured)
            </li>
            <li className="list-disc">
              <code>getRowHeight(index)</code>: measured height of a row (or its
              estimated height if it hasn't been measured)
            </li>
            <li className="list-disc">
              <code>setRowHeight(index, height)</code>: records a row's height
            </li>
            <li className="list-disc">
              <code>observeRowElements(elements)</code>: measures elements (each
              with a <code>data-index</code> attribute) as they resize; returns
              a function that stops observing them
            </li>
          </ul>
        </HookSignatureItem>
      </HookSignature>
      <Callout intent="warning">
        Dynamic row heights are not as efficient as predetermined sizes. It's
        recommended to provide your own height values if they can be determined
        ahead of time.
      </Callout>
    </Box>
  );
}
