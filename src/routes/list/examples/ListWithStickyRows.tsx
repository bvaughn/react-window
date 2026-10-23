import { cn } from "react-lib-tools";
import type { Player } from "../hooks/usePlayers";

// <begin>

import { List, type RowComponentProps } from "react-window";

// The first row leaves room for the (taller) sticky row
function rowHeight(index: number) {
  return index === 0 ? 52 : 30;
}

function Example({
  currentPlayerIndex,
  players
}: {
  currentPlayerIndex: number;
  players: Player[];
}) {
  return (
    <List
      rowComponent={RowComponent}
      // Add a row to leave room for the sticky row
      rowCount={players.length + 1}
      rowHeight={rowHeight}
      rowProps={{ currentPlayerIndex, players }}
    >
      <div className="w-full h-0 top-0 sticky">
        <CurrentStanding
          currentPlayerIndex={currentPlayerIndex}
          players={players}
        />
      </div>
    </List>
  );
}

function RowComponent({
  currentPlayerIndex,
  index,
  players,
  style
}: RowComponentProps<{ currentPlayerIndex: number; players: Player[] }>) {
  // The first row is hidden behind the sticky row
  if (index === 0) {
    return <div style={style} />;
  }

  return (
    <div style={style}>
      <Standing
        className={cn("h-full", {
          "font-bold text-sky-400": index - 1 === currentPlayerIndex
        })}
        player={players[index - 1]}
        rank={index}
      />
    </div>
  );
}

function CurrentStanding({
  currentPlayerIndex,
  players
}: {
  currentPlayerIndex: number;
  players: Player[];
}) {
  const player = players[currentPlayerIndex];
  const nextPlayer = players[currentPlayerIndex - 1];

  return (
    <div className="h-[44px] flex items-center gap-3 px-2 rounded-lg bg-linear-to-r bg-slate-800/90 text-white shadow-lg tabular-nums">
      <div className="shrink-0 size-8 flex items-center justify-center rounded-full bg-white/20 text-sm font-bold">
        #{currentPlayerIndex + 1}
      </div>
      <div className="flex-1 flex flex-col min-w-0">
        <div className="text-xs uppercase tracking-wide opacity-75">
          Your rank
        </div>
        <div className="font-bold">{player.score.toLocaleString()} pts</div>
      </div>
      {nextPlayer && (
        <div className="text-xs opacity-75">
          {(nextPlayer.score - player.score).toLocaleString()} pts to #
          {currentPlayerIndex}
        </div>
      )}
    </div>
  );
}

function Standing({
  className,
  player,
  rank
}: {
  className?: string;
  player: Player;
  rank: number;
}) {
  return (
    <div className={cn("flex items-center gap-2 px-2 tabular-nums", className)}>
      <div className="w-10 text-right">#{rank}</div>
      <div className="flex-1 truncate">{player.name}</div>
      <div>{player.score.toLocaleString()} pts</div>
    </div>
  );
}

// <end>

export { Example };
