import { useMemo } from "react";
import json from "../../../../public/data/names.json";

export type Player = { name: string; score: number };

const PLAYER_COUNT = 200;

// Rank of the current player ("You") in the leaderboard
export const CURRENT_PLAYER_INDEX = 41;

export function usePlayers(): Player[] {
  return useMemo(() => {
    let score = 9_850;

    return json.slice(0, PLAYER_COUNT).map((name, index) => {
      // Scores decrease by a deterministic (but uneven) amount
      score -= 10 + ((index * 37) % 41);

      return {
        name: index === CURRENT_PLAYER_INDEX ? "You" : name,
        score
      };
    });
  }, []);
}
