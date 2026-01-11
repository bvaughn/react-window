import { Decoder } from "./Decoder";

export default async function Page({
  params,
  searchParams: searchParamsPromise
}: {
  params: Promise<{ encoded: string }>;
  searchParams?: { [key: string]: string | undefined };
}) {
  const { encoded } = await params;

  const searchParams = await searchParamsPromise;

  return <Decoder encoded={encoded} searchParams={searchParams} />;
}
