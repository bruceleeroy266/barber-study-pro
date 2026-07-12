/**
 * Keyboard shortcut helpers
 *
 * Utilities to decide whether a global keyboard shortcut should be ignored
 * because the user is currently typing in a form field.
 */

export function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  const tag = target.tagName.toLowerCase()
  return (
    tag === 'input' ||
    tag === 'textarea' ||
    tag === 'select' ||
    target.isContentEditable === true ||
    target.contentEditable === 'true'
  )
}
