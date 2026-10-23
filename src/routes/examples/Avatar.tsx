import { cn } from "react-lib-tools";

const COLORS = [
  "bg-amber-600",
  "bg-emerald-600",
  "bg-fuchsia-600",
  "bg-indigo-600",
  "bg-rose-600",
  "bg-sky-600",
  "bg-teal-600"
];

/**
 * Example avatar; renders a person's initials on a background color derived from their name.
 */
export function Avatar({
  className,
  firstName,
  lastName
}: {
  className?: string;
  firstName: string;
  lastName: string;
}) {
  const name = firstName + lastName;

  let hash = 0;
  for (let index = 0; index < name.length; index++) {
    hash = (hash * 31 + name.charCodeAt(index)) | 0;
  }

  return (
    <div
      className={cn(
        "shrink-0 size-8 rounded-full flex items-center justify-center text-xs font-bold text-white",
        COLORS[Math.abs(hash) % COLORS.length],
        className
      )}
    >
      {firstName[0]}
      {lastName[0]}
    </div>
  );
}
