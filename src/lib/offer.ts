import logoRetro from "@/assets/radio-retro.png";
import logoDacha from "@/assets/radio-dacha.jpg";
import logoHumor from "@/assets/radio-humor.png";
import logoLove from "@/assets/radio-love.png";
import logoShanson from "@/assets/radio-shanson.jpg";
import logoAutoradio from "@/assets/radio-autoradio.jpg";

export interface OfferStation {
  id: string;
  name: string;
  frequency: string;
  dailyReach: number;
  logo: string;
  description: string;
}

export const OFFER_STATIONS: OfferStation[] = [
  { id: "love-radio", name: "Love Radio", frequency: "88.1 / 92.2 МГц", dailyReach: 700, logo: logoLove, description: "Самые романтичные хиты о любви. Музыка для влюблённых и тех, кто хочет ими стать." },
  { id: "avtoradio", name: "Авторадио", frequency: "105.3 МГц", dailyReach: 3250, logo: logoAutoradio, description: "Музыка для тех, кто за рулём. Главные хиты, новости дорог и полезная информация для автомобилистов." },
  { id: "radio-dacha", name: "Радио Дача", frequency: "105.9 МГц", dailyReach: 3250, logo: logoDacha, description: "Зажигательные песни для отдыха и хорошего настроения. Популярная музыка для дачи, дороги и души." },
  { id: "shanson", name: "Радио Шансон", frequency: "101.0 МГц", dailyReach: 2900, logo: logoShanson, description: "Настоящий шансон. Баллады, городской романс и истории о жизни без прикрас." },
  { id: "retro-fm", name: "Ретро FM", frequency: "89.0 МГц", dailyReach: 3600, logo: logoRetro, description: "Лучшие хиты 70-х, 80-х и 90-х. Ностальгия по золотой эпохе советской и зарубежной эстрады." },
  { id: "humor-fm", name: "Юмор FM", frequency: "93.9 МГц", dailyReach: 2100, logo: logoHumor, description: "Смех — лучшее лекарство! Стендапы, юмористические шоу, пародии и позитив 24 часа в сутки." },
];

export const SPOT_OPTIONS = [5, 8, 10, 12, 15];
export const DAY_OPTIONS = [15, 30];
export const DEFAULT_DURATION = 20;

// Slot coverage % sorted from best to worst (same 15 slots as the calculator)
const SLOT_COVERAGE = [12, 10, 10, 8, 8, 7, 7, 6, 6, 6, 5, 5, 5, 4, 4];

export function pricePerSec(stationsCount: number) {
  if (stationsCount >= 6) return 1.1;
  if (stationsCount >= 5) return 1.2;
  if (stationsCount >= 3) return 1.3;
  return 1.5;
}

/** Price list cost, same formula as the site calculator */
export function listPrice(stationsCount: number, spotsPerDay: number, days: number, duration = DEFAULT_DURATION) {
  if (!stationsCount || !spotsPerDay || !days) return 0;
  const total = stationsCount * spotsPerDay * days * duration * pricePerSec(stationsCount);
  const discount = spotsPerDay >= 15 ? 0.05 : 0;
  return Math.round(total * (1 - discount));
}

export function offerReach(stationIds: string[], spotsPerDay: number, days: number) {
  const listeners = OFFER_STATIONS.filter((s) => stationIds.includes(s.id)).reduce((a, s) => a + s.dailyReach, 0);
  const cov = SLOT_COVERAGE.slice(0, Math.min(spotsPerDay, 15)).reduce((a, c) => a + c, 0) / 100;
  return Math.round(listeners * cov * 0.7 * days);
}

export function makeSlug() {
  const chars = "abcdefghjkmnpqrstuvwxyz23456789";
  const arr = crypto.getRandomValues(new Uint8Array(12));
  return Array.from(arr, (b) => chars[b % chars.length]).join("");
}

export const formatRub = (n: number) => Math.round(n).toLocaleString("ru-RU") + " ₽";

export interface OfferManager { id: string; name: string; phone: string; email?: string }
export const MANAGERS: OfferManager[] = [
  { id: "galina", name: "Галина Александровна", phone: "8 (34535) 5-01-51", email: "yaradio@bk.ru" },
  { id: "nadezhda", name: "Надежда", phone: "+7 961-209-5444" },
];
export const getManager = (id?: string | null) => MANAGERS.find((m) => m.id === id) ?? MANAGERS[0];
