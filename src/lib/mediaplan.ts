// Types & Constants for Media Planning

import logoRetro from "@/assets/radio-retro.png";
import logoDacha from "@/assets/radio-dacha.jpg";
import logoHumor from "@/assets/radio-humor.png";
import logoLove from "@/assets/radio-love.png";
import logoShanson from "@/assets/radio-shanson.jpg";
import logoAutoradio from "@/assets/radio-autoradio.jpg";

export interface Station {
  id: string;
  name: string;
  freq: string;
  cities: string[];
  aud: string;
  color: string;
  logo: string;
  listeners: number;
}

export const STATIONS: Station[] = [
  { id: 'retro', name: 'Ретро FM', freq: '89.0 МГц', cities: ['Ялуторовск'], aud: '30–55 лет', color: '#FACC15', logo: logoRetro, listeners: 3600 },
  { id: 'dacha', name: 'Радио Дача', freq: '105.9 МГц', cities: ['Ялуторовск'], aud: '35–65 лет', color: '#EF4444', logo: logoDacha, listeners: 3250 },
  { id: 'humor', name: 'Юмор FM', freq: '93.9 МГц', cities: ['Ялуторовск'], aud: '25–45 лет', color: '#000000', logo: logoHumor, listeners: 2100 },
  { id: 'love', name: 'Love Radio', freq: '88.1 МГц / 92.2 МГц', cities: ['Ялуторовск', 'Заводоуковск'], aud: '18–35 лет', color: '#EC4899', logo: logoLove, listeners: 1400 },
  { id: 'shanson', name: 'Радио Шансон', freq: '101.0 МГц', cities: ['Заводоуковск'], aud: '30–60 лет', color: '#1E3A8A', logo: logoShanson, listeners: 2900 },
  { id: 'avto', name: 'Авторадио', freq: '105.3 МГц', cities: ['Заводоуковск'], aud: '25–50 лет', color: '#2563EB', logo: logoAutoradio, listeners: 3250 },
];

export const SLOTS_LABELS = [
  "07:00-08:00", "08:00-09:00", "09:00-10:00", "10:00-11:00", "11:00-12:00",
  "12:00-13:00", "13:00-14:00", "14:00-15:00", "15:00-16:00", "16:00-17:00",
  "17:00-18:00", "18:00-19:00", "19:00-20:00", "20:00-21:00", "21:00-22:00"
];

export const PRICE_TIERS: Record<number, number> = {
  6: 1.1,
  5: 1.2,
  4: 1.3,
  3: 1.3,
  2: 1.5,
  1: 1.5
};

export interface StationDetail extends Station {
  calculatedReach: number;
}

export interface MediaPlanStats {
  costPerSpot: number;
  totalSpots: number;
  baseAirCost: number;
  discountAmount: number;
  finalPrice: number;
  dailyReach: number;
  totalContacts: number;
  costPerContact: string;
  stationDetails: StationDetail[];
}

export const calculateMediaPlan = (
  selectedStationIds: string[], 
  days: number, 
  duration: number, 
  selectedSlots: number[]
): MediaPlanStats => {
  const stationCount = selectedStationIds.length;
  const slotsCount = selectedSlots.length;
  const tierKey = Math.min(Math.max(stationCount, 1), 6);
  const appliedPricePerSec = PRICE_TIERS[tierKey] || 1.5;
  
  const costPerSpot = duration * appliedPricePerSec;
  const spotsPerDay = stationCount * slotsCount;
  const totalSpots = spotsPerDay * days;
  
  let airCost = costPerSpot * totalSpots;
  
  const isMaxCoverageBonus = slotsCount === 15;
  const discount = isMaxCoverageBonus ? 0.05 : 0;
  const finalAirCost = airCost * (1 - discount);
  
  const stationDetails = STATIONS.filter(s => selectedStationIds.includes(s.id)).map(s => {
    const stationReach = Math.round(s.listeners * (slotsCount / 15 * 1.03) * 0.7);
    return {
      ...s,
      calculatedReach: stationReach
    };
  });

  const totalDailyReach = stationDetails.reduce((acc, s) => acc + s.calculatedReach, 0);
  const totalContacts = totalDailyReach * days;
  
  return {
    costPerSpot,
    totalSpots,
    baseAirCost: airCost,
    discountAmount: airCost * discount,
    finalPrice: Math.round(finalAirCost + 2000), 
    dailyReach: totalDailyReach,
    totalContacts,
    costPerContact: totalContacts > 0 ? (finalAirCost / totalContacts).toFixed(2) : '0',
    stationDetails
  };
};

export interface AIMediaPlan {
  strategy: string;
  recommendedExitsPerDay: number;
  recommendedSlotIndices: number[];
  targetAudience: string;
  recommendedStations: { name: string; reason: string }[];
  creativeTip: string;
  scripts: { version: string; text: string; duration: string }[];
}
