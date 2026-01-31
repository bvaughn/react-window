export default function Page() {
  return (
    <div className="p-2 flex flex-col gap-2">
      <a href="/list">List</a>
      <a href="/list-dynamic">List + useDynamicRowHeight</a>
      <a href="/grid">Grid</a>
    </div>
  );
}
