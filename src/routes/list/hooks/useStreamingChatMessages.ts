import { useCallback, useEffect, useMemo, useState } from "react";
import json from "../../../../public/data/group-chat.json";

export type ChatMessage = (typeof json)[number];

const CHARACTERS_PER_SECOND = 6;
const MIN_GAP = 400;

type ScheduledMessage = {
  message: ChatMessage;
  startTypingAt: number;
  sentAt: number;
};

// Simulates a group chat where several people can be typing at once.
// Each message takes as long to type as its length suggests;
// people writing longer messages start earlier so the conversation keeps flowing,
// but nobody can start typing a new message until they've sent their previous one.
function createSchedule(messages: ChatMessage[]): ScheduledMessage[] {
  const schedule: ScheduledMessage[] = [];
  const lastSentAtBySender = new Map<string, number>();

  messages.forEach((message, index) => {
    const variance = ((index * 37) % 7) / 6;
    const thinkingDuration = 400 + variance * 800;
    const desiredGap = 700 + variance * 1500;
    const typingDuration = (message.text.length * 1000) / CHARACTERS_PER_SECOND;

    const prevSentAt = schedule[index - 1]?.sentAt ?? 0;
    const startTypingAt = Math.max(
      prevSentAt + desiredGap - typingDuration,
      (lastSentAtBySender.get(message.sender) ?? 0) + thinkingDuration,
      0
    );
    const sentAt = Math.max(
      startTypingAt + typingDuration,
      prevSentAt + MIN_GAP
    );

    lastSentAtBySender.set(message.sender, sentAt);
    schedule.push({ message, startTypingAt, sentAt });
  });

  return schedule;
}

const SCHEDULE = createSchedule(json);

// Start just before the first message is sent, so the demo doesn't open on a long pause
const START_TIME = SCHEDULE[0].sentAt - 1000;

const EVENT_TIMES = SCHEDULE.flatMap(({ sentAt, startTypingAt }) => [
  sentAt,
  startTypingAt
]).sort((a, b) => a - b);

// Simulates messages arriving over time (e.g. from a server),
// along with the names of people who are currently typing
export function useStreamingChatMessages() {
  const [elapsed, setElapsed] = useState(START_TIME);
  const [restartCount, setRestartCount] = useState(0);

  useEffect(() => {
    const startTime = performance.now() - START_TIME;

    let timeout: ReturnType<typeof setTimeout> | undefined;

    const tick = () => {
      const now = performance.now() - startTime;
      setElapsed(now);

      const nextEventTime = EVENT_TIMES.find((time) => time > now);
      if (nextEventTime !== undefined) {
        timeout = setTimeout(tick, nextEventTime - now);
      }
    };

    tick();

    return () => clearTimeout(timeout);
  }, [restartCount]);

  const restart = useCallback(() => {
    setElapsed(START_TIME);
    setRestartCount((count) => count + 1);
  }, []);

  const { messages, typing } = useMemo(() => {
    const messages: ChatMessage[] = [];
    const typing: string[] = [];

    SCHEDULE.forEach(({ message, sentAt, startTypingAt }) => {
      if (sentAt <= elapsed) {
        messages.push(message);
      } else if (startTypingAt <= elapsed && message.sender !== "You") {
        // You don't see a typing indicator for your own messages
        typing.push(message.sender);
      }
    });

    return { messages, typing };
  }, [elapsed]);

  return { messages, restart, restartCount, typing };
}
