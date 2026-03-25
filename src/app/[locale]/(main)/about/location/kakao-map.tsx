'use client'

import { useEffect, useRef, useState } from 'react'
import Script from 'next/script'
import { CONTACT_INFO } from '@/lib/constants/navigation'

const KAKAO_SDK_URL = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_KEY}&libraries=services&autoload=false`

const KakaoMap = () => {
  const mapRef = useRef<HTMLDivElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!isLoaded || !mapRef.current) return

    window.kakao.maps.load(() => {
      const container = mapRef.current
      if (!container) return

      const geocoder = new window.kakao.maps.services.Geocoder()

      geocoder.addressSearch(
        CONTACT_INFO.address,
        (result: { x: string; y: string }[], status: string) => {
          if (status !== window.kakao.maps.services.Status.OK) {
            setError(true)
            return
          }

          const coords = new window.kakao.maps.LatLng(
            parseFloat(result[0].y),
            parseFloat(result[0].x)
          )

          const map = new window.kakao.maps.Map(container, {
            center: coords,
            level: 3,
          })

          const marker = new window.kakao.maps.Marker({
            map,
            position: coords,
            clickable: true,
          })

          const infowindow = new window.kakao.maps.InfoWindow({
            content: `<div style="padding:8px 12px;font-size:13px;white-space:nowrap;color:#333;background:#fff;">팍스크리스티코리아</div>`,
            removable: true,
          })

          infowindow.open(map, marker)

          kakao.maps.event.addListener(marker, 'click', () => {
            infowindow.open(map, marker)
          })
        }
      )
    })
  }, [isLoaded])

  return (
    <>
      <Script
        src={KAKAO_SDK_URL}
        strategy="afterInteractive"
        onLoad={() => setIsLoaded(true)}
        onError={() => setError(true)}
      />
      {error ? (
        <div className="flex h-[300px] items-center justify-center rounded-lg border bg-muted md:h-[400px]">
          <p className="text-sm text-muted-foreground">
            지도를 불러올 수 없습니다.
          </p>
        </div>
      ) : (
        <div
          ref={mapRef}
          className="h-[300px] w-full overflow-hidden rounded-lg border md:h-[400px]"
        />
      )}
    </>
  )
}

export default KakaoMap
