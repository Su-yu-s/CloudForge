/** @vitest-environment happy-dom */
import { describe, expect, it, vi } from 'vitest'
import { requestWorkspacePicker, workspacePickerAvailable } from '../src/workspace-picker.js'

describe('workspace picker client', () => {
  it('checks capability without a browser credential', async () => {
    const fetcher = vi.fn<typeof fetch>(
      async () => new Response(JSON.stringify({ available: true }), { status: 200 }),
    )
    await expect(workspacePickerAvailable(fetcher)).resolves.toBe(true)
    expect(fetcher).toHaveBeenCalledWith(
      '/api/workspace-picker',
      expect.objectContaining({
        method: 'GET',
        credentials: 'same-origin',
      }),
    )
    expect(fetcher.mock.calls[0]?.[1]?.headers).toBeUndefined()
  })

  it('returns selected and cancelled outcomes and keeps unavailable as a manual fallback', async () => {
    await expect(
      requestWorkspacePicker(
        vi.fn<typeof fetch>(
          async () =>
            new Response(JSON.stringify({ status: 'selected', path: '/tmp/工作区' }), { status: 200 }),
        ),
      ),
    ).resolves.toEqual({ status: 'selected', path: '/tmp/工作区' })
    await expect(
      requestWorkspacePicker(
        vi.fn<typeof fetch>(
          async () => new Response(JSON.stringify({ status: 'cancelled' }), { status: 200 }),
        ),
      ),
    ).resolves.toEqual({ status: 'cancelled' })
    await expect(
      requestWorkspacePicker(
        vi.fn<typeof fetch>(
          async () => new Response(JSON.stringify({ status: 'unavailable' }), { status: 503 }),
        ),
      ),
    ).resolves.toEqual({ status: 'unavailable' })
  })

  it('fails closed on malformed or unauthenticated results', async () => {
    await expect(
      requestWorkspacePicker(
        vi.fn<typeof fetch>(
          async () => new Response(JSON.stringify({ status: 'selected', path: '' }), { status: 200 }),
        ),
      ),
    ).rejects.toThrow('无法确认')
    await expect(
      requestWorkspacePicker(
        vi.fn<typeof fetch>(
          async () =>
            new Response(JSON.stringify({ error: { code: 'UNAUTHORIZED', detail: 'secret' } }), {
              status: 401,
            }),
        ),
      ),
    ).rejects.toThrow('无法确认')
  })

  it('recovers from an unresponsive host and aborts the pending request', async () => {
    vi.useFakeTimers()
    let signal: AbortSignal | null | undefined
    const fetcher = vi.fn<typeof fetch>(async (_input, init) => {
      signal = init?.signal
      return new Promise(() => {})
    })
    try {
      const capability = workspacePickerAvailable(fetcher)
      await vi.advanceTimersByTimeAsync(5_000)
      await expect(capability).resolves.toBe(false)
      expect(signal?.aborted).toBe(true)
      const pending = requestWorkspacePicker(fetcher)
      await vi.advanceTimersByTimeAsync(125_000)
      await expect(pending).resolves.toEqual({ status: 'unavailable' })
      expect(signal?.aborted).toBe(true)
    } finally {
      vi.useRealTimers()
    }
  })

  it('returns cancellation even when a host ignores abort and sends a late selection', async () => {
    const controller = new AbortController()
    let finish: ((response: Response) => void) | undefined
    let requestSignal: AbortSignal | null | undefined
    const pending = requestWorkspacePicker(
      vi.fn<typeof fetch>(async (_input, init) => {
        requestSignal = init?.signal
        return new Promise((resolve) => {
          finish = resolve
        })
      }),
      controller.signal,
    )
    controller.abort()
    await expect(pending).resolves.toEqual({ status: 'cancelled' })
    expect(requestSignal?.aborted).toBe(true)
    finish?.(new Response(JSON.stringify({ status: 'selected', path: '/tmp/late' })))
    await Promise.resolve()
  })
})
