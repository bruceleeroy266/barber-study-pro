/** Shared policy for invitation setup and password recovery. */
export const MIN_PASSWORD_LENGTH = 8
export const PASSWORD_REQUIREMENTS = 'At least 8 characters with uppercase, lowercase, and a number.'
export function isStrongPassword(password: string): boolean {
  return password.length >= MIN_PASSWORD_LENGTH && /[A-Z]/.test(password) && /[a-z]/.test(password) && /\d/.test(password)
}
