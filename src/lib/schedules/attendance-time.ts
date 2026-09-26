function partsForZone(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date)

  const get = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((part) => part.type === type)?.value ?? 0)

  return {
    year: get('year'),
    month: get('month'),
    day: get('day'),
    hour: get('hour'),
    minute: get('minute'),
    second: get('second'),
  }
}

function asUtcMillis(parts: {
  year: number
  month: number
  day: number
  hour: number
  minute: number
  second: number
}) {
  return Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second,
  )
}

export function zonedLocalTimeToIso(
  date: string,
  time: string,
  timeZone: string,
): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) {
    throw new Error('Invalid local date/time')
  }

  const [year, month, day] = date.split('-').map(Number)
  const [hour, minute] = time.split(':').map(Number)
  const desiredUtcLike = Date.UTC(year, month - 1, day, hour, minute, 0)

  let candidate = new Date(desiredUtcLike)

  // Iterate twice so DST offsets at the target instant settle correctly.
  for (let i = 0; i < 2; i += 1) {
    const zonedParts = partsForZone(candidate, timeZone)
    const displayedUtcLike = asUtcMillis(zonedParts)
    candidate = new Date(candidate.getTime() + (desiredUtcLike - displayedUtcLike))
  }

  const verified = partsForZone(candidate, timeZone)
  if (
    verified.year !== year ||
    verified.month !== month ||
    verified.day !== day ||
    verified.hour !== hour ||
    verified.minute !== minute
  ) {
    throw new Error('Local time does not exist in the selected timezone')
  }

  return candidate.toISOString()
}

export function isoToLocalTime(iso: string | null, timeZone: string): string {
  if (!iso) return ''
  const date = new Date(iso)
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date)
  const hour = parts.find((part) => part.type === 'hour')?.value ?? '00'
  const minute = parts.find((part) => part.type === 'minute')?.value ?? '00'
  return `${hour}:${minute}`
}

export function calculateAttendedMinutes(
  arrivalTime: string,
  departureTime: string,
  breakMinutes: number,
): number {
  const [arrivalHour, arrivalMinute] = arrivalTime.split(':').map(Number)
  const [departureHour, departureMinute] = departureTime.split(':').map(Number)
  const start = arrivalHour * 60 + arrivalMinute
  const end = departureHour * 60 + departureMinute

  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) return 0
  return Math.max(0, end - start - Math.max(0, breakMinutes || 0))
}
