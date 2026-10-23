import { cn } from "react-lib-tools";

// <begin>

import { type RowComponentProps } from "react-window";

function RowComponent({
  index,
  messages,
  style
}: RowComponentProps<{
  messages: string[];
}>) {
  // Alternate messages between two participants
  const isOutgoing = index % 2 === 1;

  return (
    <div
      className={cn("flex flex-col px-2 py-1", {
        "items-end": isOutgoing,
        "items-start": !isOutgoing
      })}
      style={style}
    >
      <div className="text-xs opacity-50 px-1 pb-0.5">
        {isOutgoing ? "You" : "Friend"}
      </div>
      <div
        className={cn("max-w-3/4 px-3 py-2 rounded-2xl", {
          "bg-sky-700 text-white rounded-br-sm": isOutgoing,
          "bg-white/10 rounded-bl-sm": !isOutgoing
        })}
      >
        {messages[index]}
      </div>
    </div>
  );
}

// <end>

export { RowComponent };
