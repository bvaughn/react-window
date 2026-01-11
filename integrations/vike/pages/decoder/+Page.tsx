import { useState } from "react";
import { usePageContext } from "vike-react/usePageContext";
import { Decoder } from "../../../tests/src";

export default function Page() {
  const { urlParsed } = usePageContext();

  const [encoded] = useState(() => urlParsed.pathname.replace("/decoder/", ""));

  const [searchParams] = useState(
    () => new URLSearchParams(urlParsed.searchOriginal || "")
  );

  return <Decoder encoded={encoded} searchParams={searchParams} />;
}
