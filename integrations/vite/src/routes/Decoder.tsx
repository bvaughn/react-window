import { useParams, useSearchParams } from "react-router";
import { Decoder } from "../../../tests/src";

export function DecoderRoute() {
  const { encoded } = useParams();
  const [searchParams] = useSearchParams();

  return <Decoder encoded={encoded ?? ""} searchParams={searchParams} />;
}
