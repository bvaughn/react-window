import { render, screen } from "@testing-library/react";
import { describe, test } from "vitest";
import { SimpleList } from "./SimpleList";

describe("SimpleList", () => {
  test("should render rows", () => {
    render(
      <SimpleList
        length={3}
        rowComponent={({ index }) => <div>Row {index}</div>}
        rowHeight={25}
        rowProps={{}}
      />,
    );

    screen.debug();
  });
});
