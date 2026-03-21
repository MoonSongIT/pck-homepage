export type PaxChristiMember = {
  id: string
  country: string
  countryEn: string
  iso3: string
  coordinates: [number, number] // [longitude, latitude]
  name: string
  nameEn: string
  continent: Continent
  established?: number
  website?: string
  isHighlighted?: boolean
}

export type Continent = 'asia' | 'europe' | 'americas' | 'africa' | 'oceania'

export const CONTINENT_LABELS: Record<Continent, { label: string; labelEn: string }> = {
  asia: { label: '아시아·태평양', labelEn: 'Asia-Pacific' },
  europe: { label: '유럽', labelEn: 'Europe' },
  americas: { label: '아메리카', labelEn: 'Americas' },
  africa: { label: '아프리카', labelEn: 'Africa' },
  oceania: { label: '오세아니아', labelEn: 'Oceania' },
}

// PCI 회원국 50개 데이터
export const MEMBER_COUNTRIES: PaxChristiMember[] = [
  // ===== 아시아·태평양 =====
  {
    id: 'kor', country: '한국', countryEn: 'South Korea', iso3: 'KOR',
    coordinates: [127.0, 37.5], name: '팍스크리스티코리아', nameEn: 'Pax Christi Korea',
    continent: 'asia', established: 2019, website: 'https://paxchristikorea.or.kr',
    isHighlighted: true,
  },
  {
    id: 'jpn', country: '일본', countryEn: 'Japan', iso3: 'JPN',
    coordinates: [139.7, 35.7], name: '팍스크리스티 일본', nameEn: 'Pax Christi Japan',
    continent: 'asia',
  },
  {
    id: 'phl', country: '필리핀', countryEn: 'Philippines', iso3: 'PHL',
    coordinates: [121.0, 14.6], name: '팍스크리스티 필리핀', nameEn: 'Pax Christi Pilipinas',
    continent: 'asia', established: 1990,
  },
  {
    id: 'ind', country: '인도', countryEn: 'India', iso3: 'IND',
    coordinates: [77.2, 28.6], name: '팍스크리스티 인도', nameEn: 'Pax Christi India',
    continent: 'asia',
  },
  {
    id: 'lka', country: '스리랑카', countryEn: 'Sri Lanka', iso3: 'LKA',
    coordinates: [79.9, 6.9], name: '팍스크리스티 스리랑카', nameEn: 'Pax Christi Sri Lanka',
    continent: 'asia',
  },
  {
    id: 'pak', country: '파키스탄', countryEn: 'Pakistan', iso3: 'PAK',
    coordinates: [73.0, 33.7], name: '팍스크리스티 파키스탄', nameEn: 'Pax Christi Pakistan',
    continent: 'asia',
  },
  {
    id: 'twn', country: '대만', countryEn: 'Taiwan', iso3: 'TWN',
    coordinates: [121.5, 25.0], name: '팍스크리스티 대만', nameEn: 'Pax Christi Taiwan',
    continent: 'asia',
  },
  {
    id: 'tls', country: '동티모르', countryEn: 'Timor-Leste', iso3: 'TLS',
    coordinates: [125.7, -8.6], name: '팍스크리스티 동티모르', nameEn: 'Pax Christi Timor-Leste',
    continent: 'asia',
  },

  // ===== 유럽 =====
  {
    id: 'bel', country: '벨기에', countryEn: 'Belgium', iso3: 'BEL',
    coordinates: [4.4, 50.8], name: '팍스크리스티 국제본부', nameEn: 'Pax Christi International',
    continent: 'europe', established: 1945, website: 'https://paxchristi.net',
  },
  {
    id: 'fra', country: '프랑스', countryEn: 'France', iso3: 'FRA',
    coordinates: [2.3, 48.9], name: '팍스크리스티 프랑스', nameEn: 'Pax Christi France',
    continent: 'europe', established: 1945,
  },
  {
    id: 'deu', country: '독일', countryEn: 'Germany', iso3: 'DEU',
    coordinates: [13.4, 52.5], name: '팍스크리스티 독일', nameEn: 'Pax Christi Germany',
    continent: 'europe', established: 1948, website: 'https://paxchristi.de',
  },
  {
    id: 'ita', country: '이탈리아', countryEn: 'Italy', iso3: 'ITA',
    coordinates: [12.5, 41.9], name: '팍스크리스티 이탈리아', nameEn: 'Pax Christi Italy',
    continent: 'europe', established: 1954,
  },
  {
    id: 'nld', country: '네덜란드', countryEn: 'Netherlands', iso3: 'NLD',
    coordinates: [4.9, 52.4], name: '팍스크리스티 네덜란드', nameEn: 'Pax Christi Netherlands',
    continent: 'europe', established: 1948,
  },
  {
    id: 'gbr', country: '영국', countryEn: 'United Kingdom', iso3: 'GBR',
    coordinates: [-0.1, 51.5], name: '팍스크리스티 영국·아일랜드', nameEn: 'Pax Christi UK',
    continent: 'europe', established: 1971, website: 'https://paxchristi.org.uk',
  },
  {
    id: 'esp', country: '스페인', countryEn: 'Spain', iso3: 'ESP',
    coordinates: [-3.7, 40.4], name: '팍스크리스티 스페인', nameEn: 'Pax Christi Spain',
    continent: 'europe',
  },
  {
    id: 'prt', country: '포르투갈', countryEn: 'Portugal', iso3: 'PRT',
    coordinates: [-9.1, 38.7], name: '팍스크리스티 포르투갈', nameEn: 'Pax Christi Portugal',
    continent: 'europe',
  },
  {
    id: 'aut', country: '오스트리아', countryEn: 'Austria', iso3: 'AUT',
    coordinates: [16.4, 48.2], name: '팍스크리스티 오스트리아', nameEn: 'Pax Christi Austria',
    continent: 'europe', established: 1956,
  },
  {
    id: 'che', country: '스위스', countryEn: 'Switzerland', iso3: 'CHE',
    coordinates: [7.4, 46.9], name: '팍스크리스티 스위스', nameEn: 'Pax Christi Switzerland',
    continent: 'europe',
  },
  {
    id: 'lux', country: '룩셈부르크', countryEn: 'Luxembourg', iso3: 'LUX',
    coordinates: [6.1, 49.6], name: '팍스크리스티 룩셈부르크', nameEn: 'Pax Christi Luxembourg',
    continent: 'europe',
  },
  {
    id: 'pol', country: '폴란드', countryEn: 'Poland', iso3: 'POL',
    coordinates: [21.0, 52.2], name: '팍스크리스티 폴란드', nameEn: 'Pax Christi Poland',
    continent: 'europe',
  },
  {
    id: 'hrv', country: '크로아티아', countryEn: 'Croatia', iso3: 'HRV',
    coordinates: [16.0, 45.8], name: '팍스크리스티 크로아티아', nameEn: 'Pax Christi Croatia',
    continent: 'europe',
  },
  {
    id: 'cze', country: '체코', countryEn: 'Czech Republic', iso3: 'CZE',
    coordinates: [14.4, 50.1], name: '팍스크리스티 체코', nameEn: 'Pax Christi Czech Republic',
    continent: 'europe',
  },
  {
    id: 'hun', country: '헝가리', countryEn: 'Hungary', iso3: 'HUN',
    coordinates: [19.0, 47.5], name: '팍스크리스티 헝가리', nameEn: 'Pax Christi Hungary',
    continent: 'europe',
  },
  {
    id: 'irl', country: '아일랜드', countryEn: 'Ireland', iso3: 'IRL',
    coordinates: [-6.3, 53.3], name: '팍스크리스티 아일랜드', nameEn: 'Pax Christi Ireland',
    continent: 'europe',
  },
  {
    id: 'mlt', country: '몰타', countryEn: 'Malta', iso3: 'MLT',
    coordinates: [14.5, 35.9], name: '팍스크리스티 몰타', nameEn: 'Pax Christi Malta',
    continent: 'europe',
  },
  {
    id: 'nor', country: '노르웨이', countryEn: 'Norway', iso3: 'NOR',
    coordinates: [10.8, 59.9], name: '팍스크리스티 노르웨이', nameEn: 'Pax Christi Norway',
    continent: 'europe',
  },
  {
    id: 'swe', country: '스웨덴', countryEn: 'Sweden', iso3: 'SWE',
    coordinates: [18.1, 59.3], name: '팍스크리스티 스웨덴', nameEn: 'Pax Christi Sweden',
    continent: 'europe',
  },
  {
    id: 'fin', country: '핀란드', countryEn: 'Finland', iso3: 'FIN',
    coordinates: [25.0, 60.2], name: '팍스크리스티 핀란드', nameEn: 'Pax Christi Finland',
    continent: 'europe',
  },
  {
    id: 'rou', country: '루마니아', countryEn: 'Romania', iso3: 'ROU',
    coordinates: [26.1, 44.4], name: '팍스크리스티 루마니아', nameEn: 'Pax Christi Romania',
    continent: 'europe',
  },

  // ===== 아메리카 =====
  {
    id: 'usa', country: '미국', countryEn: 'United States', iso3: 'USA',
    coordinates: [-77.0, 38.9], name: '팍스크리스티 미국', nameEn: 'Pax Christi USA',
    continent: 'americas', established: 1972, website: 'https://paxchristiusa.org',
  },
  {
    id: 'can', country: '캐나다', countryEn: 'Canada', iso3: 'CAN',
    coordinates: [-75.7, 45.4], name: '팍스크리스티 캐나다', nameEn: 'Pax Christi Canada',
    continent: 'americas',
  },
  {
    id: 'mex', country: '멕시코', countryEn: 'Mexico', iso3: 'MEX',
    coordinates: [-99.1, 19.4], name: '팍스크리스티 멕시코', nameEn: 'Pax Christi Mexico',
    continent: 'americas',
  },
  {
    id: 'col', country: '콜롬비아', countryEn: 'Colombia', iso3: 'COL',
    coordinates: [-74.1, 4.7], name: '팍스크리스티 콜롬비아', nameEn: 'Pax Christi Colombia',
    continent: 'americas',
  },
  {
    id: 'bra', country: '브라질', countryEn: 'Brazil', iso3: 'BRA',
    coordinates: [-47.9, -15.8], name: '팍스크리스티 브라질', nameEn: 'Pax Christi Brazil',
    continent: 'americas',
  },
  {
    id: 'per', country: '페루', countryEn: 'Peru', iso3: 'PER',
    coordinates: [-77.0, -12.0], name: '팍스크리스티 페루', nameEn: 'Pax Christi Peru',
    continent: 'americas',
  },
  {
    id: 'arg', country: '아르헨티나', countryEn: 'Argentina', iso3: 'ARG',
    coordinates: [-58.4, -34.6], name: '팍스크리스티 아르헨티나', nameEn: 'Pax Christi Argentina',
    continent: 'americas',
  },
  {
    id: 'chl', country: '칠레', countryEn: 'Chile', iso3: 'CHL',
    coordinates: [-70.7, -33.4], name: '팍스크리스티 칠레', nameEn: 'Pax Christi Chile',
    continent: 'americas',
  },
  {
    id: 'hti', country: '아이티', countryEn: 'Haiti', iso3: 'HTI',
    coordinates: [-72.3, 18.5], name: '팍스크리스티 아이티', nameEn: 'Pax Christi Haiti',
    continent: 'americas',
  },
  {
    id: 'pri', country: '푸에르토리코', countryEn: 'Puerto Rico', iso3: 'PRI',
    coordinates: [-66.1, 18.5], name: '팍스크리스티 푸에르토리코', nameEn: 'Pax Christi Puerto Rico',
    continent: 'americas',
  },

  // ===== 아프리카 =====
  {
    id: 'cod', country: '콩고민주공화국', countryEn: 'DR Congo', iso3: 'COD',
    coordinates: [15.3, -4.3], name: '팍스크리스티 콩고', nameEn: 'Pax Christi Congo',
    continent: 'africa',
  },
  {
    id: 'rwa', country: '르완다', countryEn: 'Rwanda', iso3: 'RWA',
    coordinates: [29.9, -1.9], name: '팍스크리스티 르완다', nameEn: 'Pax Christi Rwanda',
    continent: 'africa',
  },
  {
    id: 'uga', country: '우간다', countryEn: 'Uganda', iso3: 'UGA',
    coordinates: [32.6, 0.3], name: '팍스크리스티 우간다', nameEn: 'Pax Christi Uganda',
    continent: 'africa',
  },
  {
    id: 'ken', country: '케냐', countryEn: 'Kenya', iso3: 'KEN',
    coordinates: [36.8, -1.3], name: '팍스크리스티 케냐', nameEn: 'Pax Christi Kenya',
    continent: 'africa',
  },
  {
    id: 'zaf', country: '남아프리카공화국', countryEn: 'South Africa', iso3: 'ZAF',
    coordinates: [28.0, -26.2], name: '팍스크리스티 남아프리카', nameEn: 'Pax Christi South Africa',
    continent: 'africa',
  },
  {
    id: 'sen', country: '세네갈', countryEn: 'Senegal', iso3: 'SEN',
    coordinates: [-17.4, 14.7], name: '팍스크리스티 세네갈', nameEn: 'Pax Christi Senegal',
    continent: 'africa',
  },
  {
    id: 'cmr', country: '카메룬', countryEn: 'Cameroon', iso3: 'CMR',
    coordinates: [11.5, 3.9], name: '팍스크리스티 카메룬', nameEn: 'Pax Christi Cameroon',
    continent: 'africa',
  },
  {
    id: 'civ', country: '코트디부아르', countryEn: "Côte d'Ivoire", iso3: 'CIV',
    coordinates: [-5.3, 6.8], name: '팍스크리스티 코트디부아르', nameEn: "Pax Christi Côte d'Ivoire",
    continent: 'africa',
  },

  // ===== 오세아니아 =====
  {
    id: 'aus', country: '호주', countryEn: 'Australia', iso3: 'AUS',
    coordinates: [149.1, -35.3], name: '팍스크리스티 호주', nameEn: 'Pax Christi Australia',
    continent: 'oceania', established: 1985, website: 'https://paxchristi.org.au',
  },
  {
    id: 'nzl', country: '뉴질랜드', countryEn: 'New Zealand', iso3: 'NZL',
    coordinates: [174.8, -41.3], name: '팍스크리스티 뉴질랜드', nameEn: 'Pax Christi New Zealand',
    continent: 'oceania', established: 1990,
  },
]

export const NETWORK_CONFIG = {
  hero: {
    title: '국제 평화 네트워크',
    subtitle: 'Pax Christi International은 전 세계 50여 개국에서 비폭력 평화운동을 펼치고 있습니다',
  },
  mapCenter: [15, 20] as [number, number],
  mapScale: 150,
  pinSize: { default: 5, highlighted: 8 },
  sectionTitle: '대륙별 현황',
  sectionSubtitle: '전 세계 가톨릭 평화 네트워크',
  emptyMessage: '네트워크 데이터를 불러올 수 없습니다',
  pciInfo: {
    title: 'Pax Christi International',
    description: '1945년 프랑스에서 시작된 가톨릭 국제 평화운동 단체로, 유엔 경제사회이사회(ECOSOC) 특별협의지위를 보유하고 있습니다.',
    founded: 1945,
    headquarters: '브뤼셀, 벨기에',
    website: 'https://paxchristi.net',
  },
} as const

// 대륙별 회원국 수 계산 유틸
export const getContinentStats = () => {
  const stats = new Map<Continent, number>()
  for (const member of MEMBER_COUNTRIES) {
    stats.set(member.continent, (stats.get(member.continent) || 0) + 1)
  }
  return stats
}
