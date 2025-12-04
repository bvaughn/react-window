import type { Intent } from "../types";

export function getIntentClassNames(intent: Intent, minimal?: boolean) {
  switch (intent) {
    case "danger": {
      if (minimal) {
        return "bg-red-950 text-red-300 [&_svg]:text-red-500";
      }
      return "bg-black/10 bg-border border-2 border-red-500 text-white [&_svg]:text-red-500 [&_a]:text-red-400!";
    }
    case "none": {
      if (minimal) {
        return "bg-white/10 text-slate-300 [&_svg]:text-slate-400";
      }
      return "bg-black/10 bg-border border-2 border-white/40 text-white [&_svg]:text-white/60";
    }
    case "primary": {
      if (minimal) {
        return "bg-sky-950 text-sky-300 [&_svg]:text-sky-400";
      }
      return "bg-black/10 bg-border border-2 border-sky-400 text-white [&_svg]:text-sky-400";
    }
    case "success": {
      if (minimal) {
        return "bg-emerald-950 text-emerald-300 [&_svg]:text-emerald-400";
      }
      return "bg-black/10 bg-border border-2 border-emerald-400 text-white [&_svg]:text-emerald-400";
    }
    case "warning": {
      if (minimal) {
        return "bg-amber-950/65 text-amber-200 [&_svg]:text-amber-300";
      }
      return "bg-black/10 bg-border border-2 border-amber-400 text-white [&_svg]:text-amber-400 [&_a]:text-amber-400!";
    }
  }
}
