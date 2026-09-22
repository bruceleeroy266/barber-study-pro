export const MAX_STUDY_HEARTBEAT_SECONDS = 60

/**
 * Convert elapsed wall-clock time into the bounded amount a study heartbeat
 * may request. Returning 0 prevents immediate/resumed timers from claiming a
 * full minute that did not actually pass while the tab was eligible.
 */
export function calculateStudyHeartbeatSeconds(
  previousAtMs: number,
  nowMs: number,
  maxSeconds: number = MAX_STUDY_HEARTBEAT_SECONDS
): number {
  if (!Number.isFinite(previousAtMs) || !Number.isFinite(nowMs) || nowMs <= previousAtMs) {
    return 0
  }

  const elapsedSeconds = Math.floor((nowMs - previousAtMs) / 1000)
  if (elapsedSeconds <= 0) return 0

  return Math.min(Math.max(1, elapsedSeconds), Math.max(1, maxSeconds))
}
