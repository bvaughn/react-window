import { ChevronRightIcon } from "@heroicons/react/20/solid";
import type { PropsWithChildren } from "react";
import {
  Box,
  Callout,
  Code,
  ExternalLink,
  Header,
  cn,
  getIntentClassNames
} from "react-lib-tools";
import BasicRowMarkdown from "../../public/generated/examples/BasicRow.json";
import { Link } from "../components/Link";

export default function HowDoesItWorkRoute() {
  return (
    <Box direction="column" gap={4}>
      <Header title="How does it work?" />
      <div>
        Libraries like this help to render a lot of items as efficiently as
        possible by limiting how many items are rendered at once.
      </div>
      <div>
        Below is an over-simplified illustration of a list with 6 rows. Only 2
        or 3 rows are rendered at a time because that is enough to fill the
        viewport. (The user can't see the other rows, so we don't <em>need</em>{" "}
        to render them).
      </div>
      <Box
        align="center"
        className="pt-25"
        direction="row"
        gap={4}
        justify="center"
      >
        <List className="">
          <Row rendered>Row 1</Row>
          <Row rendered>Row 2</Row>
          <Row />
          <Row />
          <Row />
          <Row />
          <Viewport innerClassName="top-1" outerClassName="top-0" />
        </List>
        <ChevronRightIcon className="-mt-27 text-slate-500 w-8 h-8" />
        <List className="-mt-20">
          <Row />
          <Row rendered>Row 2</Row>
          <Row rendered>Row 3</Row>
          <Row rendered>Row 4</Row>
          <Row />
          <Row />
          <Viewport innerClassName="top-4" outerClassName="top-10" />
        </List>
        <ChevronRightIcon className="-mt-27 text-slate-500 w-8 h-8" />
        <List className="-mt-55">
          <Row />
          <Row />
          <Row />
          <Row />
          <Row rendered>Row 5</Row>
          <Row rendered>Row 6</Row>
          <Viewport innerClassName="top-11" outerClassName="top-28" />
        </List>
      </Box>
      <div>
        When a user scrolls the list, a different set of rows are rendered- but
        always only a few at a time.
      </div>
      <Callout intent="primary">
        The illustration above shows unrendered rows as dimmed. In reality, they
        aren't there at all. The rows that do get rendered are positioned using
        CSS properties like{" "}
        <ExternalLink href="https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/top">
          top
        </ExternalLink>{" "}
        to mimic other rows above them.
      </Callout>
      <div>
        To render one of these rows, all you need to provide is a component like
        the one below.
      </div>
      <Code html={BasicRowMarkdown.html} />
      <div>
        Continue to the <Link to="/list/fixed-row-height">list examples</Link>{" "}
        to learn more.
      </div>
    </Box>
  );
}

function List({
  children,
  className
}: PropsWithChildren<{ className: string }>) {
  return (
    <div
      className={cn("relative flex flex-col gap-1 p-2 pr-6 w-30", className)}
    >
      {children}
    </div>
  );
}

function Row({
  children,
  rendered
}: {
  children?: string;
  rendered?: boolean;
}) {
  return (
    <div
      className={cn(
        "h-6 p-2 flex items-center rounded text-xs whitespace-nowrap",
        rendered
          ? getIntentClassNames("primary", true)
          : getIntentClassNames("none", true),
        rendered ? "" : "opacity-50"
      )}
    >
      {children}
    </div>
  );
}

function Viewport({
  innerClassName,
  outerClassName
}: {
  innerClassName: string;
  outerClassName: string;
}) {
  return (
    <div
      className={cn(
        "rounded rounded-md border border-2 border-white absolute left-0 h-17 w-full",
        outerClassName
      )}
    >
      <div className="absolute right-0 h-full w-4 bg-white/5">
        <div
          className={cn(
            "absolute right-1 h-4 w-2 rounded bg-white/50",
            innerClassName
          )}
        ></div>
      </div>
    </div>
  );
}
