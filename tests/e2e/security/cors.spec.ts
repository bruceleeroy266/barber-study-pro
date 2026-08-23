import { expect, test } from '@playwright/test'

const protectedApi = '/api/instructor/escalations'

test.describe('CORS security contract', () => {
  test('protected APIs do not authorize an unapproved origin', async ({ request }) => {
    const response = await request.get(protectedApi, {
      headers: { Origin: 'https://unapproved.invalid' },
    })

    expect(response.headers()['access-control-allow-origin']).toBeUndefined()
    expect(response.headers()['access-control-allow-credentials']).toBeUndefined()
  })

  test('protected APIs do not emit CORS headers for same-origin or originless requests', async ({ request, baseURL }) => {
    const sameOrigin = new URL(baseURL || 'http://localhost:3001').origin
    const [sameOriginResponse, originlessResponse] = await Promise.all([
      request.get(protectedApi, { headers: { Origin: sameOrigin } }),
      request.get(protectedApi),
    ])

    for (const response of [sameOriginResponse, originlessResponse]) {
      expect(response.headers()['access-control-allow-origin']).toBeUndefined()
      expect(response.headers()['access-control-allow-credentials']).toBeUndefined()
    }
  })

  test('protected API preflight does not authorize an unapproved origin', async ({ request }) => {
    const response = await request.fetch(protectedApi, {
      method: 'OPTIONS',
      headers: {
        Origin: 'https://unapproved.invalid',
        'Access-Control-Request-Method': 'GET',
      },
    })

    expect(response.headers()['access-control-allow-origin']).toBeUndefined()
    expect(response.headers()['access-control-allow-credentials']).toBeUndefined()
  })
})
