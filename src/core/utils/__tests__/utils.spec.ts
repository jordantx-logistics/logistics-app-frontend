import { afterEach, describe, expect, it, vi } from 'vitest'

import { useToast } from '@/core/composables/useToast'
import { saveBlob } from '@/core/utils/download'
import { EMPTY_VALUE, formatDate, formatText, localIsoDate } from '@/core/utils/format'
import { matchesQuery, pageCount, slicePage } from '@/core/utils/list'

afterEach(() => {
  vi.useRealTimers()
})

describe('format', () => {
  it('pinta el vacío en lugar de nada', () => {
    expect(formatDate(null)).toBe(EMPTY_VALUE)
    expect(formatDate('')).toBe(EMPTY_VALUE)
    expect(formatDate('no es fecha')).toBe(EMPTY_VALUE)
    expect(formatText(undefined)).toBe(EMPTY_VALUE)
    expect(formatText(0)).toBe('0')
  })

  it('formatea una fecha válida', () => {
    expect(formatDate('2026-10-18T12:00:00Z')).not.toBe(EMPTY_VALUE)
  })

  it('la fecha local no salta al día UTC', () => {
    vi.useFakeTimers()
    // 23:30 locales: en cualquier zona al oeste de UTC, `toISOString` ya sería mañana.
    vi.setSystemTime(new Date(2026, 9, 31, 23, 30))

    expect(localIsoDate()).toBe('2026-10-31')
    expect(localIsoDate(1)).toBe('2026-11-01')
    expect(localIsoDate(-31)).toBe('2026-09-30')
  })
})

describe('list', () => {
  it('busca sin distinguir mayúsculas', () => {
    expect(matchesQuery(['Lima', null], 'lim')).toBe(true)
    expect(matchesQuery(['Lima'], 'cusco')).toBe(false)
    expect(matchesQuery([], '  ')).toBe(true)
  })

  it('trocea sin mutar y siempre hay una página', () => {
    const rows = [1, 2, 3]

    expect(slicePage(rows, 2, 2)).toEqual([3])
    expect(rows).toHaveLength(3)
    expect(pageCount(0, 10)).toBe(1)
    expect(pageCount(11, 10)).toBe(2)
  })
})

describe('download', () => {
  it('materializa el blob y libera la URL', () => {
    const create = vi.fn<(blob: Blob) => string>().mockReturnValue('blob:x')
    const revoke = vi.fn<(url: string) => void>()
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => undefined)

    vi.stubGlobal('URL', { createObjectURL: create, revokeObjectURL: revoke })

    saveBlob(new Blob(['x']), 'report.csv')

    expect(click).toHaveBeenCalled()
    expect(revoke).toHaveBeenCalledWith('blob:x')
    expect(document.querySelector('a[download]')).toBeNull()

    vi.unstubAllGlobals()
    click.mockRestore()
  })
})

describe('useToast', () => {
  it('muestra cada tipo y lo retira al vencer', () => {
    vi.useFakeTimers()
    const { toasts, success, error, warning, info } = useToast()

    toasts.value = []
    success('a')
    vi.advanceTimersByTime(1)
    error('b', 'detail')
    vi.advanceTimersByTime(1)
    warning('c')
    vi.advanceTimersByTime(1)
    info('d')

    expect(toasts.value.map((toast) => toast.type)).toEqual(['success', 'error', 'warning', 'info'])

    vi.advanceTimersByTime(3000)

    expect(toasts.value).toEqual([])
  })
})
