"use client";

import { useState } from "react";
import { Decoder as DecoderExternal } from "../../../../tests";

export function Decoder({
  encoded: encodedProp,
  searchParams: searchParamsMap
}: {
  encoded: string;
  searchParams: { [key: string]: string | undefined } | undefined;
}) {
  const [encoded] = useState(() => decodeURIComponent(encodedProp));

  const [searchParams] = useState(() => {
    const params = new URLSearchParams();
    for (const key in searchParamsMap) {
      params.set(key, searchParamsMap[key] ?? "");
    }

    return params;
  });

  return <DecoderExternal encoded={encoded} searchParams={searchParams} />;
}
