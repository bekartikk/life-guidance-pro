/**
 * LoadingChat
 *
 * Skeleton for the AI Coach / Chat tab (ChatExtensionTab).
 * Mirrors the layout:
 *   – Section header
 *   – Quick-prompt chip row
 *   – Message thread (alternating user / AI bubbles)
 *   – Textarea + send button at the bottom
 *
 * Props:
 *   messageCount {number}  Total message bubble stubs (default 4).
 *   className    {string}
 */
import { cn } from "../../lib/cn.js";
import {
  SkeletonCard,
  SkeletonSectionHeader,
  SkeletonTextarea,
  SkeletonButton,
  SkeletonAvatar,
  Shimmer,
} from "./SkeletonBase.jsx";

/* ── Quick-prompt chips ─────────────────────────────────────────── */

function QuickPromptRow() {
  const chipWidths = ["w-24", "w-36", "w-28", "w-32", "w-40"];
  return (
    <div className="flex flex-wrap gap-2" aria-hidden="true">
      {chipWidths.map((w, i) => (
        <Shimmer key={i} className={cn("h-9 rounded-full", w)} />
      ))}
    </div>
  );
}

/* ── Single message bubble ──────────────────────────────────────── */

function MessageBubble({ isUser = false }) {
  /* User messages align right; AI messages align left with an avatar */
  if (isUser) {
    return (
      <div className="flex justify-end" aria-hidden="true">
        <div className="flex max-w-[75%] flex-col items-end gap-1">
          <Shimmer className="h-12 w-full rounded-2xl rounded-br-sm" />
          <Shimmer className="h-3 w-20 rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3" aria-hidden="true">
      <SkeletonAvatar size="sm" />
      <div className="flex max-w-[75%] flex-col gap-1">
        <Shimmer className="h-20 w-full rounded-2xl rounded-tl-sm" />
        <Shimmer className="h-3 w-24 rounded-full" />
      </div>
    </div>
  );
}

/* ── Main export ────────────────────────────────────────────────── */

function LoadingChat({ messageCount = 4, className }) {
  return (
    <div
      role="status"
      aria-label="Loading AI coach"
      aria-busy="true"
      className={cn("flex flex-col gap-5", className)}
    >
      {/* Section header */}
      <SkeletonCard className="flex flex-col gap-4">
        <SkeletonSectionHeader />
      </SkeletonCard>

      {/* Quick prompts */}
      <SkeletonCard className="flex flex-col gap-4">
        <Shimmer className="h-3.5 w-48" />  {/* sub-heading */}
        <QuickPromptRow />
      </SkeletonCard>

      {/* Message thread */}
      <SkeletonCard className="flex flex-col gap-5">
        <Shimmer className="h-3.5 w-36" />  {/* "Conversation" label */}

        <div className="flex flex-col gap-4">
          {Array.from({ length: messageCount }).map((_, i) => (
            <MessageBubble key={i} isUser={i % 2 === 0} />
          ))}
        </div>
      </SkeletonCard>

      {/* Input area */}
      <SkeletonCard className="flex flex-col gap-4">
        <SkeletonTextarea rows={3} />
        <div className="flex justify-end" aria-hidden="true">
          <SkeletonButton wide />
        </div>
      </SkeletonCard>
    </div>
  );
}

export default LoadingChat;
