import * as XLSX from 'xlsx';
import { SLOTS_LABELS, MediaPlanStats } from './mediaplan';

interface ExportParams {
  stats: MediaPlanStats;
  days: number;
  duration: number;
  slotIndices: number[];
  aiInput?: string;
  mediaPlan?: {
    scripts?: { version: string; text: string; duration: string }[];
  };
}

export const exportToExcel = ({
  stats,
  days,
  duration,
  slotIndices,
  aiInput = '',
  mediaPlan
}: ExportParams) => {
  const slotsCount = slotIndices.length;
  const stationNames = stats.stationDetails.map(s => s.name.toUpperCase()).join(', ');

  const scriptRows = mediaPlan?.scripts ? mediaPlan.scripts.flatMap((s, i) => [
    [""],
    [`СЦЕНАРИЙ №${i + 1} (${s.duration}):`],
    [s.text]
  ]) : [];

  const rows = [
    ["МЕДИАПЛАН КАМПАНИИ #R-062222"],
    ["РАДИО ТЮМЕНСКОЙ ОБЛАСТИ"],
    [""],
    ["✅ Ваша заявка принята! Спасибо за доверие!"],
    [""],
    ["ПАРАМЕТРЫ КАМПАНИИ:"],
    [`• Радиостанции: ${stationNames}`],
    [`• Период: ${days} дней`],
    [`• Выходов в день: ${slotsCount * stats.stationDetails.length}`],
    [`• Всего выходов за период: ${stats.totalSpots}`],
    [`• Хронометраж ролика: ${duration} сек`],
    [`• Текст ролика (Запрос):`],
    [aiInput || "Не указан"],
    ...scriptRows,
    [""],
    ["• Производство: СТАНДАРТНЫЙ РОЛИК"],
    ["ВЫБРАННЫЕ РАДИОСТАНЦИИ:"],
    ...stats.stationDetails.map(s => [`• ${s.name}: ~${s.calculatedReach.toLocaleString()} слушателей`]),
    [`• ИТОГО: ~${stats.dailyReach.toLocaleString()} слушателей`],
    [""],
    ["ВЫБРАННЫЕ ВРЕМЕННЫЕ СЛОТЫ:"],
    ...slotIndices.map(i => [`• ${SLOTS_LABELS[i] || 'Слот ' + i}`]),
    [""],
    ["РАСЧЕТНЫЕ КОНТАКТЫ ЗА ПЕРИОД:"],
    [`• Выходов в день: ${slotsCount * stats.stationDetails.length}`],
    [`• Ежедневный охват: ~${stats.dailyReach.toLocaleString()} чел.`],
    [`• Контактов за период: ~${stats.totalContacts.toLocaleString()} чел.`],
    [""],
    ["ФИНАНСОВАЯ ИНФОРМАЦИЯ:"],
    ["Позиция", "Сумма (₽)"],
    ["Эфирное время", stats.finalPrice - 2000],
    ["Производство ролика", 2000],
    [""],
    ["Базовая стоимость", stats.finalPrice],
    ["Стоимость 1 контакта", stats.costPerContact],
    [""],
    ["ИТОГО", stats.finalPrice],
    [""],
    ["ВАШИ КОНТАКТЫ:"],
    ["• Компания: РТО"],
    [""],
    ["НАШИ КОНТАКТЫ:"],
    ["• Email: man@ya-radio.ru"],
    ["• Telegram: @AlexeyKhlistunov"],
    [""],
    ["СТАРТ КАМПАНИИ:"],
    ["В течение 24 часов после подтверждения"],
    [""],
    [`Дата формирования: ${new Date().toLocaleString()}`]
  ];

  const ws = XLSX.utils.aoa_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Медиаплан");
  XLSX.writeFile(wb, `Медиаплан_РТО_${new Date().toLocaleDateString()}.xlsx`);
};
