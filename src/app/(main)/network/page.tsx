import type { Metadata } from 'next'

import { NetworkContent } from './network-content'

export const metadata: Metadata = {
  title: '국제 평화 네트워크 | 팍스크리스티코리아',
  description:
    'Pax Christi International은 전 세계 50여 개국에서 비폭력 평화운동을 펼치고 있습니다. 세계 지도에서 각국 지부를 확인하세요.',
}

export default function NetworkPage() {
  return <NetworkContent />
}
