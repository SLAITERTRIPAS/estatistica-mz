// Dados climáticos e geográficos de todas as províncias e distritos de Moçambique

export interface DistrictWeather {
  name: string;
  temp: number;
  max: number;
  min: number;
  condition: string;
  icon: string;
  humidity: number;
  windSpeed: number;
}

export interface ProvinceWeather {
  id: string;
  name: string;
  capital: string;
  region: 'Sul' | 'Centro' | 'Norte';
  lat: number;
  lon: number;
  temp: number;
  max: number;
  min: number;
  condition: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  districts: DistrictWeather[];
}

export interface ProvinceGeoDef {
  name: string;
  capital: string;
  region: 'Sul' | 'Centro' | 'Norte';
  lat: number;
  lon: number;
  baseTemp: number;
  baseMin: number;
  baseMax: number;
  humidity: number;
  wind: number;
  districts: { name: string; tempOffset?: number }[];
}

export const MOZAMBIQUE_PROVINCES_GEO: ProvinceGeoDef[] = [
  {
    name: "Maputo Cidade",
    capital: "KaMpfumo (Maputo)",
    region: "Sul",
    lat: -25.9692,
    lon: 32.5732,
    baseTemp: 28,
    baseMin: 21,
    baseMax: 31,
    humidity: 68,
    wind: 16,
    districts: [
      { name: "KaMpfumo (Distrito Urbano 1)", tempOffset: 0 },
      { name: "Nlhamankulu (Distrito Urbano 2)", tempOffset: 0 },
      { name: "KaMaxakeni (Distrito Urbano 3)", tempOffset: 0 },
      { name: "KaMavota (Distrito Urbano 4)", tempOffset: 0 },
      { name: "KaMubukwana (Distrito Urbano 5)", tempOffset: 0 },
      { name: "KaTembe (Catembe)", tempOffset: -1 },
      { name: "KaNyaka (Ilha de Inhaca)", tempOffset: -1 }
    ]
  },
  {
    name: "Maputo Província",
    capital: "Matola",
    region: "Sul",
    lat: -25.65,
    lon: 32.3,
    baseTemp: 29,
    baseMin: 21,
    baseMax: 32,
    humidity: 66,
    wind: 14,
    districts: [
      { name: "Matola", tempOffset: 0 },
      { name: "Boane", tempOffset: +1 },
      { name: "Magude", tempOffset: +2 },
      { name: "Manhiça", tempOffset: 0 },
      { name: "Marracuene", tempOffset: 0 },
      { name: "Matutuíne", tempOffset: -1 },
      { name: "Moamba", tempOffset: +1 },
      { name: "Namaacha (Fronteira/Planalto)", tempOffset: -3 }
    ]
  },
  {
    name: "Gaza",
    capital: "Xai-Xai",
    region: "Sul",
    lat: -25.0444,
    lon: 33.6406,
    baseTemp: 30,
    baseMin: 22,
    baseMax: 33,
    humidity: 64,
    wind: 15,
    districts: [
      { name: "Xai-Xai (Cidade)", tempOffset: 0 },
      { name: "Bilene (Praia)", tempOffset: -1 },
      { name: "Chibuto", tempOffset: +1 },
      { name: "Chicualacuala", tempOffset: +2 },
      { name: "Chigubo", tempOffset: +3 },
      { name: "Chókwè (Regadio)", tempOffset: +1 },
      { name: "Guijá", tempOffset: +1 },
      { name: "Limpopo", tempOffset: 0 },
      { name: "Mabalane", tempOffset: +2 },
      { name: "Mandlakazi (Manjacaze)", tempOffset: 0 },
      { name: "Mapai", tempOffset: +3 },
      { name: "Massangena", tempOffset: +3 },
      { name: "Massingir (Barragem)", tempOffset: +2 }
    ]
  },
  {
    name: "Inhambane",
    capital: "Inhambane",
    region: "Sul",
    lat: -23.865,
    lon: 35.3833,
    baseTemp: 29,
    baseMin: 22,
    baseMax: 32,
    humidity: 72,
    wind: 18,
    districts: [
      { name: "Inhambane (Cidade)", tempOffset: 0 },
      { name: "Maxixe", tempOffset: 0 },
      { name: "Funhalouro", tempOffset: +2 },
      { name: "Govuro", tempOffset: +1 },
      { name: "Homoíne", tempOffset: 0 },
      { name: "Inharrime", tempOffset: 0 },
      { name: "Inhassoro", tempOffset: 0 },
      { name: "Jangamo", tempOffset: 0 },
      { name: "Mabote", tempOffset: +3 },
      { name: "Massinga", tempOffset: 0 },
      { name: "Morrumbene", tempOffset: 0 },
      { name: "Panda", tempOffset: +1 },
      { name: "Vilankulo (Arquipélago)", tempOffset: 0 },
      { name: "Zavala", tempOffset: 0 }
    ]
  },
  {
    name: "Sofala",
    capital: "Beira",
    region: "Centro",
    lat: -19.8436,
    lon: 34.8389,
    baseTemp: 30,
    baseMin: 23,
    baseMax: 33,
    humidity: 76,
    wind: 17,
    districts: [
      { name: "Beira (Cidade Portuária)", tempOffset: 0 },
      { name: "Búzi", tempOffset: 0 },
      { name: "Caia (Ponte Zambeze)", tempOffset: +3 },
      { name: "Chemba", tempOffset: +3 },
      { name: "Cheringoma", tempOffset: +1 },
      { name: "Chibabava", tempOffset: +1 },
      { name: "Dondo", tempOffset: 0 },
      { name: "Gorongosa (Parque Nacional)", tempOffset: -2 },
      { name: "Machanga", tempOffset: 0 },
      { name: "Maringué", tempOffset: +2 },
      { name: "Marromeu", tempOffset: +1 },
      { name: "Muanza", tempOffset: +1 },
      { name: "Nhamatanda", tempOffset: 0 }
    ]
  },
  {
    name: "Manica",
    capital: "Chimoio",
    region: "Centro",
    lat: -19.1167,
    lon: 33.4833,
    baseTemp: 27,
    baseMin: 18,
    baseMax: 30,
    humidity: 62,
    wind: 12,
    districts: [
      { name: "Chimoio (Cidade)", tempOffset: 0 },
      { name: "Báruè (Catandica)", tempOffset: -1 },
      { name: "Gondola", tempOffset: 0 },
      { name: "Guro", tempOffset: +3 },
      { name: "Macate", tempOffset: 0 },
      { name: "Machaze", tempOffset: +2 },
      { name: "Macossa", tempOffset: +2 },
      { name: "Manica (Fronteira)", tempOffset: -1 },
      { name: "Mossurize (Espungabera)", tempOffset: -1 },
      { name: "Sussundenga (Serra da Gorongosa)", tempOffset: -2 },
      { name: "Tambara (Vale do Zambeze)", tempOffset: +4 },
      { name: "Vanduzi", tempOffset: 0 }
    ]
  },
  {
    name: "Tete",
    capital: "Tete",
    region: "Centro",
    lat: -16.1564,
    lon: 33.5864,
    baseTemp: 35,
    baseMin: 25,
    baseMax: 39,
    humidity: 48,
    wind: 11,
    districts: [
      { name: "Tete (Cidade)", tempOffset: 0 },
      { name: "Angónia (Ulongué / Planalto)", tempOffset: -4 },
      { name: "Cahora-Bassa (Songo / Albufeira)", tempOffset: -1 },
      { name: "Changara", tempOffset: +1 },
      { name: "Chifunde", tempOffset: -1 },
      { name: "Chiuta", tempOffset: 0 },
      { name: "Doa", tempOffset: +1 },
      { name: "Macanga (Furancungo)", tempOffset: -2 },
      { name: "Mágoè", tempOffset: +1 },
      { name: "Marara", tempOffset: +1 },
      { name: "Marávia (Fingoè)", tempOffset: -1 },
      { name: "Moatize (Bacia Carbonífera)", tempOffset: +1 },
      { name: "Mutarara", tempOffset: +1 },
      { name: "Tsangano (Planalto Alto)", tempOffset: -5 },
      { name: "Zumbo (Fronteira Tríplice)", tempOffset: +1 }
    ]
  },
  {
    name: "Zambézia",
    capital: "Quelimane",
    region: "Centro",
    lat: -17.8786,
    lon: 36.8883,
    baseTemp: 31,
    baseMin: 23,
    baseMax: 34,
    humidity: 72,
    wind: 14,
    districts: [
      { name: "Quelimane (Cidade)", tempOffset: 0 },
      { name: "Alto Molócuè", tempOffset: -1 },
      { name: "Chinde (Foz do Zambeze)", tempOffset: 0 },
      { name: "Derre", tempOffset: +1 },
      { name: "Gilé", tempOffset: 0 },
      { name: "Gurué (Montanhas de Chá)", tempOffset: -4 },
      { name: "Ile", tempOffset: -1 },
      { name: "Inhassunge", tempOffset: 0 },
      { name: "Luabo", tempOffset: +1 },
      { name: "Lugela", tempOffset: 0 },
      { name: "Maganja da Costa", tempOffset: 0 },
      { name: "Milange (Fronteira)", tempOffset: -2 },
      { name: "Mocuba", tempOffset: +1 },
      { name: "Mocubela", tempOffset: 0 },
      { name: "Molumbo", tempOffset: -2 },
      { name: "Mopeia", tempOffset: +1 },
      { name: "Morrumbala", tempOffset: +1 },
      { name: "Mulevala", tempOffset: 0 },
      { name: "Namacurra", tempOffset: 0 },
      { name: "Namarroi", tempOffset: -2 },
      { name: "Nicoadala", tempOffset: 0 },
      { name: "Pebane (Litoral)", tempOffset: 0 }
    ]
  },
  {
    name: "Nampula",
    capital: "Nampula",
    region: "Norte",
    lat: -15.1165,
    lon: 39.2666,
    baseTemp: 31,
    baseMin: 22,
    baseMax: 35,
    humidity: 64,
    wind: 13,
    districts: [
      { name: "Nampula (Cidade)", tempOffset: 0 },
      { name: "Angoche (Cidade Costeira)", tempOffset: -1 },
      { name: "Eráti (Namapa)", tempOffset: +1 },
      { name: "Ilha de Moçambique (Património)", tempOffset: -1 },
      { name: "Lalaua", tempOffset: 0 },
      { name: "Larde", tempOffset: 0 },
      { name: "Liúpo", tempOffset: 0 },
      { name: "Malema", tempOffset: -2 },
      { name: "Meconta", tempOffset: 0 },
      { name: "Mecubúri", tempOffset: 0 },
      { name: "Memba", tempOffset: 0 },
      { name: "Mogincual", tempOffset: 0 },
      { name: "Mogovolas", tempOffset: 0 },
      { name: "Moma", tempOffset: 0 },
      { name: "Monapo", tempOffset: 0 },
      { name: "Mossuril", tempOffset: 0 },
      { name: "Muecate", tempOffset: 0 },
      { name: "Murrupula", tempOffset: 0 },
      { name: "Nacala-Porto (Baía)", tempOffset: 0 },
      { name: "Nacala-a-Velha", tempOffset: 0 },
      { name: "Nacarôa", tempOffset: 0 },
      { name: "Rapale", tempOffset: 0 },
      { name: "Ribáuè (Serra)", tempOffset: -2 }
    ]
  },
  {
    name: "Niassa",
    capital: "Lichinga",
    region: "Norte",
    lat: -13.3125,
    lon: 35.2406,
    baseTemp: 25,
    baseMin: 16,
    baseMax: 28,
    humidity: 58,
    wind: 15,
    districts: [
      { name: "Lichinga (Planalto / Capital)", tempOffset: 0 },
      { name: "Chimbonila", tempOffset: 0 },
      { name: "Cuamba (Nó Ferroviário)", tempOffset: +4 },
      { name: "Lago (Metangula / Lago Niassa)", tempOffset: +1 },
      { name: "Majune", tempOffset: +2 },
      { name: "Mandimba", tempOffset: +1 },
      { name: "Marrupa", tempOffset: +2 },
      { name: "Maúa", tempOffset: +2 },
      { name: "Mavago", tempOffset: +2 },
      { name: "Mecanhelas", tempOffset: +2 },
      { name: "Mecula (Reserva do Niassa)", tempOffset: +3 },
      { name: "Metarica", tempOffset: +2 },
      { name: "Muembe", tempOffset: 0 },
      { name: "N'gauma", tempOffset: 0 },
      { name: "Nipepe", tempOffset: +3 },
      { name: "Sanga", tempOffset: 0 }
    ]
  },
  {
    name: "Cabo Delgado",
    capital: "Pemba",
    region: "Norte",
    lat: -12.9732,
    lon: 40.5178,
    baseTemp: 31,
    baseMin: 24,
    baseMax: 34,
    humidity: 74,
    wind: 16,
    districts: [
      { name: "Pemba (Baía de Pemba)", tempOffset: 0 },
      { name: "Ancuabe", tempOffset: +1 },
      { name: "Balama", tempOffset: +1 },
      { name: "Chiúre", tempOffset: +1 },
      { name: "Ibo (Arquipélago das Quirimbas)", tempOffset: -1 },
      { name: "Macomia", tempOffset: 0 },
      { name: "Mecúfi", tempOffset: 0 },
      { name: "Meluco", tempOffset: +1 },
      { name: "Metuge", tempOffset: 0 },
      { name: "Mocímboa da Praia", tempOffset: 0 },
      { name: "Montepuez (Rubi / Interior)", tempOffset: +2 },
      { name: "Mueda (Planalto dos Macondes)", tempOffset: -3 },
      { name: "Muidumbe", tempOffset: -1 },
      { name: "Namuno", tempOffset: +1 },
      { name: "Nangade", tempOffset: 0 },
      { name: "Palma (Gás / Extremo Norte)", tempOffset: 0 },
      { name: "Quissanga", tempOffset: 0 }
    ]
  }
];

export function getWeatherConditionByCode(code: number): { condition: string; icon: string } {
  if (code === 0) return { condition: "Céu Limpo", icon: "☀️" };
  if (code === 1) return { condition: "Predominantemente Limpo", icon: "🌤️" };
  if (code === 2) return { condition: "Parcialmente Nublado", icon: "⛅" };
  if (code === 3) return { condition: "Nublado", icon: "☁️" };
  if (code >= 45 && code <= 48) return { condition: "Nevoeiro / Bruma", icon: "🌫️" };
  if (code >= 51 && code <= 55) return { condition: "Chuviscos", icon: "🌦️" };
  if (code >= 61 && code <= 65) return { condition: "Chuva Moderada", icon: "🌧️" };
  if (code >= 80 && code <= 82) return { condition: "Aguaceiros", icon: "🌧️" };
  if (code >= 95 && code <= 99) return { condition: "Trovoada", icon: "⛈️" };
  return { condition: "Ensolarado", icon: "☀️" };
}
