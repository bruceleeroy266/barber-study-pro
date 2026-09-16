export interface OrderedAnswer<T> {
  item: T
  originalIndex: number
  displayIndex: number
  displayLabel: string
}

const DISPLAY_LABELS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

function hashString(value: string): number {
  let hash = 2166136261
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

function seededShuffle<T>(items: readonly T[], seed: number): T[] {
  const result = [...items]
  let state = seed || 1

  const nextRandom = () => {
    state = Math.imul(state ^ (state >>> 15), 1 | state)
    state ^= state + Math.imul(state ^ (state >>> 7), 61 | state)
    return ((state ^ (state >>> 14)) >>> 0) / 4294967296
  }

  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(nextRandom() * (index + 1))
    ;[result[index], result[swapIndex]] = [result[swapIndex], result[index]]
  }

  return result
}

/**
 * Reorders an interactive answer set without changing answer identity.
 *
 * The preferred answer is intentionally distributed across display positions
 * (A/B/C/D...) by item index, while distractors are deterministically shuffled.
 * This prevents answer-position patterns without causing hydration or re-render
 * instability in client components.
 */
export function orderInteractiveAnswers<T>(
  items: readonly T[],
  preferredIndex: number,
  itemIndex: number,
  sectionKey: string,
): OrderedAnswer<T>[] {
  if (items.length === 0) return []

  const safePreferredIndex = preferredIndex >= 0 && preferredIndex < items.length ? preferredIndex : 0
  const preferredItem = items[safePreferredIndex]
  const distractors = items
    .map((item, originalIndex) => ({ item, originalIndex }))
    .filter(({ originalIndex }) => originalIndex !== safePreferredIndex)

  const sectionOffset = hashString(sectionKey) % items.length
  const targetDisplayIndex = (sectionOffset + itemIndex) % items.length
  const shuffledDistractors = seededShuffle(
    distractors,
    hashString(`${sectionKey}:${itemIndex}:${items.length}`),
  )

  const ordered = [...shuffledDistractors]
  ordered.splice(targetDisplayIndex, 0, {
    item: preferredItem,
    originalIndex: safePreferredIndex,
  })

  return ordered.map(({ item, originalIndex }, displayIndex) => ({
    item,
    originalIndex,
    displayIndex,
    displayLabel: DISPLAY_LABELS[displayIndex] ?? String(displayIndex + 1),
  }))
}
