import { test, expect } from '@playwright/test'

/**
 * Explicit opt-in, local disposable school-owner CSV probe.
 * This route uses a browser Blob download, not an HTTP /api/export endpoint.
 * Never run against production; positive controls prevent vacuous "no B" PASS.
 */
const need = (k: string) => {
  const v = process.env[k]
  if (!v) throw new Error('Missing disposable school export fixture ' + k)
  return v
}
test('4D-5 actual Reporting Center CSV download does not contain B data', async ({ page }) => {
  const base = new URL(need('EXAM_ISOLATION_REPORT_URL'))
  if (!['127.0.0.1','localhost'].includes(base.hostname)) throw new Error('Local disposable app required')
  const aMarker = need('EXAM_ISOLATION_A_CSV_MARKER')
  const bMarker = need('EXAM_ISOLATION_B_CSV_MARKER')
  if (aMarker === bMarker || aMarker.length < 8 || bMarker.length < 8) throw new Error('Distinct populated A/B markers required')
  await page.goto(new URL('/login', base).toString())
  await page.getByLabel(/email/i).fill(need('EXAM_ISOLATION_A_EMAIL'))
  await page.getByLabel(/password/i).fill(need('EXAM_ISOLATION_A_PASSWORD'))
  await page.getByRole('button', {name:/sign in|log in/i}).click()
  await expect(page).not.toHaveURL(/\/login(?:\?|$)/)
  await page.goto(new URL('/school',base).toString())
  const center = page.getByText('Reporting Center', {exact:true})
  await expect(center).toBeVisible()
  const downloadPromise = page.waitForEvent('download')
  await page.getByRole('button',{name:'Export CSV'}).click()
  const download = await downloadPromise
  expect(download.suggestedFilename()).toMatch(/-report\.csv$/)
  const stream = await download.createReadStream()
  if (!stream) throw new Error('Browser did not produce actual CSV file')
  const chunks: Buffer[] = []
  for await (const chunk of stream) chunks.push(Buffer.isBuffer(chunk)?chunk:Buffer.from(chunk))
  const csv = Buffer.concat(chunks).toString('utf8')
  expect(csv).toContain(aMarker)
  expect(csv).not.toContain(bMarker)
})
