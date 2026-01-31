import Link from "next/link";

export default async function Home() {
  return (
    <div className="p-2 flex flex-col gap-2">
      <Link href="/list">List</Link>
      <Link href="/list-dynamic">List + useDynamicRowHeight</Link>
      <Link href="/grid">Grid</Link>
    </div>
  );
}
