/* eslint-disable @typescript-eslint/no-explicit-any */
declare namespace kakao.maps {
  class LatLng {
    constructor(lat: number, lng: number)
  }
  class Map {
    constructor(container: HTMLElement, options: { center: LatLng; level: number })
    setCenter(latlng: LatLng): void
  }
  class Marker {
    constructor(options: { map?: Map; position: LatLng; clickable?: boolean })
    setMap(map: Map | null): void
  }
  class InfoWindow {
    constructor(options: { content: string; removable?: boolean })
    open(map: Map, marker: Marker): void
    close(): void
  }
  namespace event {
    function addListener(target: any, type: string, handler: () => void): void
  }
  namespace services {
    const Status: { OK: string }
    class Geocoder {
      addressSearch(
        address: string,
        callback: (result: { x: string; y: string }[], status: string) => void
      ): void
    }
  }
  function load(callback: () => void): void
}

interface Window {
  kakao: {
    maps: typeof kakao.maps & {
      load: (callback: () => void) => void
    }
  }
}
