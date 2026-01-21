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

export function generateMediaPlanJSON(
  aiResponse: MediaPlanResponse,
  originalQuery: string
): MediaPlanJSON {
  const stationsCount = aiResponse.calculation.stations_count;
  const slotsCount = Math.ceil(aiResponse.calculation.spots_per_day / stationsCount);
  const duration = 20;
  
  // Determine price tier
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
      production_option: "standard",
      production_cost: 2000,
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
        discount: 0,
        final_price: aiResponse.calculation.estimated_cost,
        production_cost_included: 2000,
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

export function exportToExcel(mediaPlan: MediaPlanJSON): void {
  const wb = XLSX.utils.book_new();

  // Summary sheet
  const summaryData = [
    ["МЕДИАПЛАН РТО", ""],
    ["", ""],
    ["Дата создания", new Date(mediaPlan.meta.created_at).toLocaleDateString("ru-RU")],
    ["Стратегия", mediaPlan.strategy.title],
    ["Описание", mediaPlan.strategy.description],
    ["", ""],
    ["ПАРАМЕТРЫ КАМПАНИИ", ""],
    ["Количество станций", mediaPlan.input_data.selected_radios.length],
    ["Дней размещения", mediaPlan.input_data.campaign_days],
    ["Хронометраж ролика", `${mediaPlan.input_data.duration} сек`],
    ["", ""],
    ["ФИНАНСОВЫЕ ПОКАЗАТЕЛИ", ""],
    ["Стоимость кампании", mediaPlan.final_output.display_strings.price_text],
    ["Охват аудитории", mediaPlan.final_output.display_strings.reach_text],
    ["Стоимость контакта", mediaPlan.final_output.display_strings.cpc_text],
    ["Всего выходов", mediaPlan.intermediate_calculations.spots_logic.total_spots_period],
  ];
  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(wb, summarySheet, "Сводка");

  // Stations sheet
  const stationsData = [
    ["Станция", "Частота", "Причина выбора"],
    ...mediaPlan.input_data.selected_radios.map((name, i) => {
      const listeners = STATION_LISTENERS[Object.keys(STATION_LISTENERS).find(k => 
        k.toUpperCase() === name || name.includes(k.toUpperCase())
      ) || ""] || 0;
      return [name, `${listeners} слушателей`, ""];
    }),
  ];
  const stationsSheet = XLSX.utils.aoa_to_sheet(stationsData);
  XLSX.utils.book_append_sheet(wb, stationsSheet, "Станции");

  // Scripts sheet
  const scriptsData = [
    ["Вариант", "Хронометраж", "Текст ролика"],
    ...mediaPlan.scripts.map((script, i) => [
      `${i + 1}. ${script.title}`,
      `${script.duration} сек`,
      script.text,
    ]),
  ];
  const scriptsSheet = XLSX.utils.aoa_to_sheet(scriptsData);
  XLSX.utils.book_append_sheet(wb, scriptsSheet, "Тексты роликов");

  // Creative tips sheet
  const creativeData = [
    ["КРЕАТИВНЫЕ РЕКОМЕНДАЦИИ", ""],
    ["", ""],
    ["Советы:", ""],
    ...mediaPlan.creative.tips.map((tip, i) => [`${i + 1}.`, tip]),
    ["", ""],
    ["Крючки:", ""],
    ...mediaPlan.creative.hooks.map((hook, i) => [`${i + 1}.`, hook]),
  ];
  const creativeSheet = XLSX.utils.aoa_to_sheet(creativeData);
  XLSX.utils.book_append_sheet(wb, creativeSheet, "Креатив");

  // Download file
  const fileName = `Медиаплан_РТО_${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(wb, fileName);
}

export function downloadJSON(mediaPlan: MediaPlanJSON): void {
  const dataStr = JSON.stringify(mediaPlan, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `Медиаплан_РТО_${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
