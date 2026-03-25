const TOSS_SECRET = process.env.TOSS_SECRET_KEY!
const TOSS_API_URL = 'https://api.tosspayments.com/v1/payments'

export type TossPaymentResult = {
  paymentKey: string
  orderId: string
  status: string
  totalAmount: number
  method: string
  requestedAt: string
  approvedAt: string
  receipt?: { url: string }
}

export async function confirmPayment(
  paymentKey: string,
  orderId: string,
  amount: number,
): Promise<TossPaymentResult> {
  const response = await fetch(`${TOSS_API_URL}/confirm`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${TOSS_SECRET}:`).toString('base64')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ paymentKey, orderId, amount }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || '결제 승인에 실패했습니다')
  }

  return response.json()
}
