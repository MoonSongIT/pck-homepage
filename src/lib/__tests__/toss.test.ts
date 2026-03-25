import { describe, it, expect, vi, beforeEach } from 'vitest'
import { confirmPayment } from '../payments/toss'

// fetch를 mock
const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

describe('confirmPayment', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('결제 승인 성공 시 결과를 반환한다', async () => {
    const mockResult = {
      paymentKey: 'pk_test_123',
      orderId: 'order_abc',
      status: 'DONE',
      totalAmount: 10000,
      method: '카드',
      requestedAt: '2026-03-25T10:00:00',
      approvedAt: '2026-03-25T10:00:01',
    }

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResult),
    })

    const result = await confirmPayment('pk_test_123', 'order_abc', 10000)
    expect(result).toEqual(mockResult)
    expect(mockFetch).toHaveBeenCalledOnce()
    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.tosspayments.com/v1/payments/confirm',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({
          paymentKey: 'pk_test_123',
          orderId: 'order_abc',
          amount: 10000,
        }),
      }),
    )
  })

  it('결제 실패 시 에러를 throw한다', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ message: '잔액이 부족합니다' }),
    })

    await expect(confirmPayment('pk_test_123', 'order_abc', 10000))
      .rejects
      .toThrow('잔액이 부족합니다')
  })

  it('에러 메시지 없으면 기본 메시지를 사용한다', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({}),
    })

    await expect(confirmPayment('pk_test_123', 'order_abc', 10000))
      .rejects
      .toThrow('결제 승인에 실패했습니다')
  })

  it('Authorization 헤더에 Base64 인코딩된 시크릿을 포함한다', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({}),
    })

    await confirmPayment('pk', 'oid', 1000)

    const callArgs = mockFetch.mock.calls[0]
    const headers = callArgs[1].headers
    expect(headers.Authorization).toMatch(/^Basic /)
  })
})
