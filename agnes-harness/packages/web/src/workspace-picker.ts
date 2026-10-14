export type WorkspacePickerResult =
  | { status: 'selected'; path: string }
  | { status: 'cancelled' }
  | { status: 'unavailable' }

type Fetcher = typeof fetch

async function boundedRequest<T>(
  request: (signal: AbortSignal) => Promise<T>,
  timeoutMs: number,
  fallback: T,
  signal?: AbortSignal,
): Promise<T> {
  if (signal?.aborted) return fallback
  const controller = new AbortController()
  let cancel!: () => void
  const aborted = new Promise<T>((resolve) => {
    cancel = () => {
      resolve(fallback)
      controller.abort()
    }
  })
  signal?.addEventListener('abort', cancel, { once: true })
  const timer = setTimeout(cancel, timeoutMs)
  try {
    return await Promise.race([request(controller.signal), aborted])
  } finally {
    clearTimeout(timer)
    signal?.removeEventListener('abort', cancel)
  }
}

export async function workspacePickerAvailable(fetcher: Fetcher = fetch): Promise<boolean> {
  try {
    return await boundedRequest(
      async (signal) => {
        const response = await fetcher('/api/workspace-picker', {
          method: 'GET',
          cache: 'no-store',
          credentials: 'same-origin',
          signal,
        })
        if (!response.ok) return false
        const body = (await response.json()) as { available?: unknown }
        return body.available === true
      },
      5_000,
      false,
    )
  } catch {
    return false
  }
}

export async function requestWorkspacePicker(
  fetcher: Fetcher = fetch,
  signal?: AbortSignal,
): Promise<WorkspacePickerResult> {
  const result = await boundedRequest(
    (requestSignal) => readPickerResponse(fetcher, requestSignal),
    125_000,
    { status: 'unavailable' } as WorkspacePickerResult,
    signal,
  )
  return signal?.aborted ? { status: 'cancelled' } : result
}

async function readPickerResponse(fetcher: Fetcher, signal: AbortSignal): Promise<WorkspacePickerResult> {
  const response = await fetcher('/api/workspace-picker', {
    method: 'POST',
    cache: 'no-store',
    credentials: 'same-origin',
    signal,
  })
  let body: { status?: unknown; path?: unknown }
  try {
    body = (await response.json()) as typeof body
  } catch {
    throw new Error('系统目录选择器返回了无法确认的结果。')
  }
  if (body.status === 'cancelled') return { status: 'cancelled' }
  if (body.status === 'unavailable') return { status: 'unavailable' }
  if (
    response.ok &&
    body.status === 'selected' &&
    typeof body.path === 'string' &&
    body.path.length > 0 &&
    body.path.length <= 4096 &&
    !body.path.includes('\0')
  )
    return { status: 'selected', path: body.path }
  throw new Error('系统目录选择器返回了无法确认的结果。')
}
