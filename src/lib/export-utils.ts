import * as XLSX from 'xlsx';
import { MediaPlanResponse, MediaPlanJSON } from './mediaplan-types';

const STATION_LISTENERS: Record<string, number> = {
  "Ретро FM": 3600,
  "Радио Дача": 3250,
  "Юмор FM": 2100,
  "Love Radio": 700,
  "Радио Шансон": 2900,
  "Авторадио": 3250,
};

const PRICE_TIERS: Record<string, number> = {
  "1_2_stations": 1.5,
  "3_4_stations": 1.3,
  "5_stations": 1.2,
  "6_stations": 1.1,
};

// Generate unique plan ID
function generatePlanId(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "R-";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function generateMediaPlanJSON(
  aiResponse: MediaPlanResponse,
  originalQuery: string
): MediaPlanJSON {
  const stationsCount = aiResponse.calculation.stations_count;
  const slotsCount = aiResponse.calculation.slots_count || Math.max(7, Math.ceil(aiResponse.calculation.spots_per_day / stationsCount));
  const duration = 20;
  
  let appliedPrice = 1.5;
  if (stationsCount >= 6) appliedPrice = 1.1;
  else if (stationsCount >= 5) appliedPrice = 1.2;
  else if (stationsCount >= 3) appliedPrice = 1.3;

  const costPerSpot = duration * appliedPrice;
  const baseCost = costPerSpot * aiResponse.calculation.total_spots;
  
  const bonusDiscount = slotsCount >= 15 ? 0.05 : 0;
  const airCostAfterDiscounts = baseCost * (1 - bonusDiscount);

  const selectedRadios = aiResponse.recommendedStations.map(s => s.name.toUpperCase());
  const totalListeners = selectedRadios.reduce((sum, name) => {
    const normalized = Object.keys(STATION_LISTENERS).find(
      k => k.toUpperCase() === name || name.includes(k.toUpperCase())
    );
    return sum + (normalized ? STATION_LISTENERS[normalized] : 0);
  }, 0);

  const uniqueFactor = 0.7;
  const dailyCoverage = Math.round(totalListeners * uniqueFactor);

  return {
    meta: {
      description: "Полный расчет рекламной кампании (Backend Logic)",
      app_name: "YaRadioBot / Radio TO",
      scenario: aiResponse.strategy.title,
      created_at: new Date().toISOString(),
      client_query: originalQuery,
    },
    input_data: {
      selected_radios: selectedRadios,
      selected_time_slots: Array.from({ length: slotsCount }, (_, i) => i),
      campaign_days: aiResponse.calculation.campaign_days,
      duration: duration,
      production_option: "gift",
      production_cost: 0,
    },
    constants_used: {
      station_listeners: STATION_LISTENERS,
      total_listeners_base: totalListeners,
      price_tiers: PRICE_TIERS,
      applied_price_per_sec: appliedPrice,
      min_budget: 7000,
    },
    intermediate_calculations: {
      spots_logic: {
        stations_count: stationsCount,
        slots_count: slotsCount,
        spots_per_day: aiResponse.calculation.spots_per_day,
        total_spots_period: aiResponse.calculation.total_spots,
      },
      financial_logic: {
        cost_per_spot_base: costPerSpot,
        base_air_cost_total: baseCost,
        premium_slots_count: slotsCount,
        is_max_coverage_bonus: slotsCount >= 15,
        time_multiplier: 1.0,
        bonus_discount_percent: bonusDiscount,
        air_cost_after_discounts: airCostAfterDiscounts,
      },
      audience_logic: {
        sum_slots_coverage_percent: 100,
        potential_daily_contacts: totalListeners,
        unique_factor: uniqueFactor,
        unique_daily_coverage: dailyCoverage,
      },
    },
    final_output: {
      financials: {
        base_price: aiResponse.calculation.estimated_cost,
        discount: bonusDiscount * 100,
        final_price: aiResponse.calculation.estimated_cost,
        production_cost_included: 0,
      },
      metrics: {
        daily_coverage_people: dailyCoverage,
        total_contacts_period: aiResponse.calculation.estimated_reach,
        cost_per_contact: aiResponse.calculation.cost_per_contact,
      },
      display_strings: {
        price_text: `${aiResponse.calculation.estimated_cost.toLocaleString()} ₽`,
        reach_text: `~${aiResponse.calculation.estimated_reach.toLocaleString()} чел.`,
        cpc_text: `${aiResponse.calculation.cost_per_contact.toFixed(2)} ₽`,
      },
    },
    strategy: aiResponse.strategy,
    creative: aiResponse.creative,
    scripts: aiResponse.scripts,
  };
}

// Single-page Excel with ALL data: plan, scripts, creative
export function exportToExcel(mediaPlan: MediaPlanJSON): string {
  const wb = XLSX.utils.book_new();
  const planId = generatePlanId();
  
  const now = new Date();
  const dateStr = now.toLocaleDateString("ru-RU");
  const timeStr = now.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });

  const stationNames = mediaPlan.input_data.selected_radios.join(", ");
  const startDate = now.toISOString().split("T")[0];
  const endDate = new Date(now.getTime() + mediaPlan.input_data.campaign_days * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  // Calculate total listeners
  const totalListeners = mediaPlan.input_data.selected_radios.reduce((sum, name) => {
    const normalized = Object.keys(STATION_LISTENERS).find(
      k => k.toUpperCase() === name || name.includes(k.toUpperCase())
    );
    return sum + (normalized ? STATION_LISTENERS[normalized] : 0);
  }, 0);

  const dailyReach = Math.round(mediaPlan.final_output.metrics.total_contacts_period / mediaPlan.input_data.campaign_days);

  // ALL DATA ON ONE SHEET
  const data: any[][] = [
    [`МЕДИАПЛАН КАМПАНИИ #${planId}`],
    ["РАДИО ТЮМЕНСКОЙ ОБЛАСТИ"],
    [""],
    ["ПАРАМЕТРЫ КАМПАНИИ:"],
    [`Радиостанции: ${stationNames}`],
    [`Период: ${startDate} - ${endDate} (${mediaPlan.input_data.campaign_days} дней)`],
    [`Выходов в день: ${mediaPlan.intermediate_calculations.spots_logic.spots_per_day}`],
    [`Всего выходов за период: ${mediaPlan.intermediate_calculations.spots_logic.total_spots_period}`],
    [`Хронометраж ролика: ${mediaPlan.input_data.duration} сек`],
    ["Производство: В ПОДАРОК"],
    [""],
    ["ВЫБРАННЫЕ РАДИОСТАНЦИИ:", "Слушатели"],
  ];

  // Add stations
  mediaPlan.input_data.selected_radios.forEach(name => {
    const normalized = Object.keys(STATION_LISTENERS).find(
      k => k.toUpperCase() === name || name.includes(k.toUpperCase())
    );
    const listeners = normalized ? STATION_LISTENERS[normalized] : 0;
    data.push([name, `~${listeners.toLocaleString()} слушателей`]);
  });
  data.push([`ИТОГО`, `~${totalListeners.toLocaleString()} слушателей`]);
  
  data.push([""], ["РАСЧЕТНЫЕ КОНТАКТЫ ЗА ПЕРИОД:"]);
  data.push([`Выходов в день: ${mediaPlan.intermediate_calculations.spots_logic.spots_per_day}`]);
  data.push([`Ежедневный охват: ~${dailyReach.toLocaleString()} чел.`]);
  data.push([`Контактов за период: ~${mediaPlan.final_output.metrics.total_contacts_period.toLocaleString()} чел.`]);
  
  data.push([""], ["ФИНАНСОВАЯ ИНФОРМАЦИЯ:", "Сумма (₽)"]);
  data.push(["Эфирное время", mediaPlan.final_output.financials.final_price]);
  data.push(["Производство ролика", "БЕСПЛАТНО"]);
  if (mediaPlan.final_output.financials.discount > 0) {
    data.push([`Скидка ${mediaPlan.final_output.financials.discount}%`, "Применена"]);
  }
  data.push(["Стоимость 1 контакта", `${mediaPlan.final_output.metrics.cost_per_contact.toFixed(2)} ₽`]);
  data.push(["ИТОГО", mediaPlan.final_output.financials.final_price]);

  // Scripts section
  data.push([""], [""], ["ТЕКСТЫ РОЛИКОВ:"]);
  mediaPlan.scripts.forEach((script, i) => {
    data.push([`Вариант ${i + 1}: ${script.title} (${script.duration} сек)`]);
    data.push([script.text]);
    data.push([""]);
  });

  // Creative section
  data.push(["КРЕАТИВНЫЕ РЕКОМЕНДАЦИИ:"]);
  data.push(["Советы:"]);
  mediaPlan.creative.tips.forEach((tip, i) => {
    data.push([`${i + 1}. ${tip}`]);
  });
  data.push(["", ""], ["Креативные крючки:"]);
  mediaPlan.creative.hooks.forEach((hook, i) => {
    data.push([`${i + 1}. ${hook}`]);
  });

  // Contacts
  data.push([""], [""], ["НАШИ КОНТАКТЫ:"]);
  data.push(["Телефон: 8 (34535) 5-01-51"]);
  data.push(["Email: yaradio@bk.ru"]);
  data.push(["Telegram: @YaRadioBot"]);
  data.push([""], [`Дата формирования: ${dateStr} ${timeStr}`]);

  const sheet = XLSX.utils.aoa_to_sheet(data);
  sheet["!cols"] = [{ wch: 65 }, { wch: 25 }];
  XLSX.utils.book_append_sheet(wb, sheet, "Медиаплан");

  const fileName = `Медиаплан_РТО_${planId}.xlsx`;
  XLSX.writeFile(wb, fileName);
  
  return planId;
}

// Calculator Excel export - single page
export function exportCalculatorExcel(params: {
  stations: string;
  stationsCount: number;
  timeSlots: string;
  slotsCount: number;
  days: number;
  duration: number;
  pricePerSec: number;
  totalSpots: number;
  spotsPerDay: number;
  finalPrice: number;
  totalReach: number;
  costPerContact: number;
  isMaxCoverage: boolean;
}): string {
  const wb = XLSX.utils.book_new();
  const planId = generatePlanId();
  
  const now = new Date();
  const dateStr = now.toLocaleDateString("ru-RU");
  const timeStr = now.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
  const startDate = now.toISOString().split("T")[0];
  const endDate = new Date(now.getTime() + params.days * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  const dailyReach = params.days > 0 ? Math.round(params.totalReach / params.days) : 0;

  const data: any[][] = [
    [`РАСЧЁТ РЕКЛАМНОЙ КАМПАНИИ #${planId}`],
    ["РАДИО ТЮМЕНСКОЙ ОБЛАСТИ"],
    [""],
    ["ПАРАМЕТРЫ КАМПАНИИ:"],
    [`Радиостанции: ${params.stations}`],
    [`Количество станций: ${params.stationsCount}`],
    [`Период: ${startDate} - ${endDate} (${params.days} дней)`],
    [`Время эфира: ${params.timeSlots}`],
    [`Слотов: ${params.slotsCount}`],
    [`Хронометраж ролика: ${params.duration} сек`],
    [`Тариф: ${params.pricePerSec} ₽/сек`],
    [`Выходов в день: ${params.spotsPerDay}`],
    [`Всего выходов: ${params.totalSpots}`],
    ["Производство: В ПОДАРОК"],
    [""],
    ["РАСЧЕТНЫЕ КОНТАКТЫ ЗА ПЕРИОД:"],
    [`Выходов в день: ${params.spotsPerDay}`],
    [`Ежедневный охват: ~${dailyReach.toLocaleString()} чел.`],
    [`Контактов за период: ~${params.totalReach.toLocaleString()} чел.`],
    [""],
    ["ФИНАНСОВАЯ ИНФОРМАЦИЯ:", "Сумма (₽)"],
    ["Эфирное время", params.finalPrice],
    ["Производство ролика", "БЕСПЛАТНО"],
  ];

  if (params.isMaxCoverage) {
    data.push(["Скидка 5% за макс. охват", "Применена"]);
  }

  data.push(["Стоимость 1 контакта", `${params.costPerContact.toFixed(2)} ₽`]);
  data.push(["ИТОГО", params.finalPrice]);
  
  data.push([""], [""], ["НАШИ КОНТАКТЫ:"]);
  data.push(["Телефон: 8 (34535) 5-01-51"]);
  data.push(["Email: yaradio@bk.ru"]);
  data.push(["Telegram: @YaRadioBot"]);
  data.push([""], [`Дата формирования: ${dateStr} ${timeStr}`]);

  const sheet = XLSX.utils.aoa_to_sheet(data);
  sheet["!cols"] = [{ wch: 55 }, { wch: 20 }];
  XLSX.utils.book_append_sheet(wb, sheet, "Расчёт");

  const fileName = `Расчёт_РТО_${planId}.xlsx`;
  XLSX.writeFile(wb, fileName);
  
  return planId;
}
