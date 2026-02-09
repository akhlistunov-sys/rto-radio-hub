import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import * as XLSX from "npm:xlsx@0.18.5";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface MediaPlanRequest {
  type?: "calculator_request" | "media_plan";
  clientEmail: string;
  clientName: string;
  clientPhone?: string;
  clientData?: Record<string, any>;
  mediaPlan?: {
    strategy: {
      title: string;
      description: string;
    };
    recommendedStations: Array<{
      name: string;
      freq: string;
      reason: string;
    }>;
    creative: {
      tips: string[];
      hooks: string[];
    };
    scripts: Array<{
      title: string;
      duration: number;
      text: string;
    }>;
    calculation: {
      stations_count: number;
      spots_per_day: number;
      campaign_days: number;
      total_spots: number;
      estimated_reach: number;
      estimated_cost: number;
      cost_per_contact: number;
    };
  };
  originalQuery?: string;
}

const ADMIN_EMAIL = "a.khlistunov@gmail.com";

const STATION_LISTENERS: Record<string, number> = {
  "Ретро FM": 3600,
  "Радио Дача": 3250,
  "Юмор FM": 2100,
  "Love Radio": 700,
  "Радио Шансон": 2900,
  "Авторадио": 3250,
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

// Generate Excel file for media plan
function generateMediaPlanExcel(
  mediaPlan: MediaPlanRequest["mediaPlan"],
  clientName: string,
  clientEmail: string,
  clientPhone: string | undefined,
  originalQuery: string | undefined,
  planId: string
): Uint8Array {
  const wb = XLSX.utils.book_new();
  
  const now = new Date();
  const dateStr = now.toLocaleDateString("ru-RU");
  const timeStr = now.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
  
  // Calculate period
  const startDate = now.toISOString().split("T")[0];
  const endDate = new Date(now.getTime() + mediaPlan!.calculation.campaign_days * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
  
  // Get station names
  const stationNames = mediaPlan!.recommendedStations.map(s => s.name.toUpperCase()).join(", ");
  
  // Calculate total listeners
  const totalListeners = mediaPlan!.recommendedStations.reduce((sum, s) => {
    const normalized = Object.keys(STATION_LISTENERS).find(
      k => k.toUpperCase() === s.name.toUpperCase() || s.name.toUpperCase().includes(k.toUpperCase())
    );
    return sum + (normalized ? STATION_LISTENERS[normalized] : 0);
  }, 0);

  // Main summary data - formatted like the sample
  const summaryData = [
    [`МЕДИАПЛАН КАМПАНИИ #${planId}`, ""],
    ["РАДИО ТЮМЕНСКОЙ ОБЛАСТИ", ""],
    ["", ""],
    ["✅ Ваша заявка принята! Спасибо за доверие!", ""],
    ["", ""],
    ["📊 ПАРАМЕТРЫ КАМПАНИИ:", ""],
    [`• Радиостанции: ${stationNames}`, ""],
    [`• Период: ${startDate} - ${endDate} (${mediaPlan!.calculation.campaign_days} дней)`, ""],
    [`• Выходов в день: ${mediaPlan!.calculation.spots_per_day}`, ""],
    [`• Всего выходов за период: ${mediaPlan!.calculation.total_spots}`, ""],
    [`• Хронометраж ролика: 20 сек`, ""],
    ["• Варианты текстов роликов:", ""],
    ...mediaPlan!.scripts.map((s, i) => [`вариант ${i + 1}: ${s.title}`, ""]),
    ["", ""],
    ["• Производство: В ПОДАРОК", ""],
    ["📻 ВЫБРАННЫЕ РАДИОСТАНЦИИ:", ""],
    ...mediaPlan!.recommendedStations.map(s => {
      const normalized = Object.keys(STATION_LISTENERS).find(
        k => k.toUpperCase() === s.name.toUpperCase() || s.name.toUpperCase().includes(k.toUpperCase())
      );
      const listeners = normalized ? STATION_LISTENERS[normalized] : 0;
      return [`• ${s.name}: ~${listeners.toLocaleString()} слушателей`, ""];
    }),
    [`• ИТОГО: ~${totalListeners.toLocaleString()} слушателей`, ""],
    ["", ""],
    ["🕒 РЕКОМЕНДУЕМЫЕ ВРЕМЕННЫЕ СЛОТЫ:", ""],
    ["• 07:00-08:00 - Утренние поездки", ""],
    ["• 08:00-09:00 - Пик трафика", ""],
    ["• 09:00-10:00 - Начало работы", ""],
    ["• 12:00-13:00 - Обеденный перерыв", ""],
    ["• 13:00-14:00 - После обеда", ""],
    ["• 16:00-17:00 - Конец рабочего дня", ""],
    ["• 17:00-18:00 - Вечерние поездки", ""],
    ["• 18:00-19:00 - Пик трафика", ""],
    ["", ""],
    ["🎯 РАСЧЕТНЫЕ КОНТАКТЫ ЗА ПЕРИОД:", ""],
    [`• Выходов в день: ${mediaPlan!.calculation.spots_per_day}`, ""],
    [`• Ежедневный охват: ~${Math.round(mediaPlan!.calculation.estimated_reach / mediaPlan!.calculation.campaign_days).toLocaleString()} чел.`, ""],
    [`• Контактов за период: ~${mediaPlan!.calculation.estimated_reach.toLocaleString()} чел.`, ""],
    ["💰 ФИНАНСОВАЯ ИНФОРМАЦИЯ:", ""],
    ["Позиция", "Сумма (₽)"],
    ["Эфирное время", mediaPlan!.calculation.estimated_cost],
    ["Производство ролика", "БЕСПЛАТНО"],
    ["", ""],
    ["Базовая стоимость", mediaPlan!.calculation.estimated_cost],
    ["Стоимость 1 контакта", mediaPlan!.calculation.cost_per_contact.toFixed(2)],
    ["", ""],
    ["ИТОГО", mediaPlan!.calculation.estimated_cost],
    ["", ""],
    ["👤 ВАШИ КОНТАКТЫ:", ""],
    [`• Имя: ${clientName}`, ""],
    [`• Телефон: ${clientPhone || "Не указан"}`, ""],
    [`• Email: ${clientEmail}`, ""],
    ["", ""],
    ["📞 НАШИ КОНТАКТЫ:", ""],
    ["• Email: yaradio@bk.ru", ""],
    ["• Telegram: @YaRadioBot", ""],
    ["• Телефон: 8 (34535) 5-01-51", ""],
    ["", ""],
    ["🎯 СТАРТ КАМПАНИИ:", ""],
    ["В течение 24 часов после подтверждения", ""],
    ["", ""],
    [`📅 Дата формирования: ${dateStr} ${timeStr}`, ""],
  ];

  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
  
  // Set column widths
  summarySheet["!cols"] = [{ wch: 60 }, { wch: 15 }];
  
  XLSX.utils.book_append_sheet(wb, summarySheet, "Медиаплан");

  // Scripts sheet
  const scriptsData = [
    ["🎙️ ТЕКСТЫ РОЛИКОВ", "", ""],
    ["", "", ""],
    ["Вариант", "Хронометраж", "Текст"],
    ...mediaPlan!.scripts.map((script, i) => [
      `${i + 1}. ${script.title}`,
      `${script.duration} сек`,
      script.text,
    ]),
  ];
  const scriptsSheet = XLSX.utils.aoa_to_sheet(scriptsData);
  scriptsSheet["!cols"] = [{ wch: 25 }, { wch: 15 }, { wch: 80 }];
  XLSX.utils.book_append_sheet(wb, scriptsSheet, "Тексты роликов");

  // Creative tips sheet
  const creativeData = [
    ["💡 КРЕАТИВНЫЕ РЕКОМЕНДАЦИИ", ""],
    ["", ""],
    ["Советы:", ""],
    ...mediaPlan!.creative.tips.map((tip, i) => [`${i + 1}. ${tip}`, ""]),
    ["", ""],
    ["Креативные крючки:", ""],
    ...mediaPlan!.creative.hooks.map((hook, i) => [`${i + 1}. ${hook}`, ""]),
  ];
  const creativeSheet = XLSX.utils.aoa_to_sheet(creativeData);
  creativeSheet["!cols"] = [{ wch: 60 }];
  XLSX.utils.book_append_sheet(wb, creativeSheet, "Креатив");

  // Write to buffer
  const excelBuffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
  return new Uint8Array(excelBuffer);
}

// Generate Excel for calculator request
function generateCalculatorExcel(
  clientData: Record<string, any>,
  clientName: string,
  clientEmail: string,
  clientPhone: string | undefined,
  planId: string
): Uint8Array {
  const wb = XLSX.utils.book_new();
  
  const now = new Date();
  const dateStr = now.toLocaleDateString("ru-RU");
  const timeStr = now.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
  
  const summaryData = [
    [`РАСЧЁТ РЕКЛАМНОЙ КАМПАНИИ #${planId}`, ""],
    ["РАДИО ТЮМЕНСКОЙ ОБЛАСТИ", ""],
    ["", ""],
    ["✅ Ваша заявка принята! Спасибо за доверие!", ""],
    ["", ""],
    ["📊 ПАРАМЕТРЫ КАМПАНИИ:", ""],
    [`• Радиостанции: ${clientData.stations}`, ""],
    [`• Количество станций: ${clientData.stationsCount}`, ""],
    [`• Время эфира: ${clientData.timeSlots}`, ""],
    [`• Слотов: ${clientData.slotsCount}`, ""],
    [`• Срок размещения: ${clientData.days} дней`, ""],
    [`• Хронометраж ролика: ${clientData.duration} сек`, ""],
    [`• Всего выходов: ${clientData.totalSpots}`, ""],
    ["", ""],
    ["💰 ФИНАНСОВАЯ ИНФОРМАЦИЯ:", ""],
    ["Позиция", "Сумма (₽)"],
    ["Эфирное время", clientData.finalPrice],
    ["Производство ролика", "БЕСПЛАТНО"],
    ["", ""],
    ["Базовая стоимость", clientData.finalPrice],
    [`Скидка за макс. охват`, clientData.bonusDiscount || "0%"],
    ["", ""],
    ["ИТОГО", clientData.finalPrice],
    ["", ""],
    ["🎯 РАСЧЕТНЫЕ ПОКАЗАТЕЛИ:", ""],
    [`• Охват аудитории: ~${clientData.totalReach?.toLocaleString()} чел.`, ""],
    [`• Стоимость 1 контакта: ${clientData.costPerContact} ₽`, ""],
    ["", ""],
    ["👤 ВАШИ КОНТАКТЫ:", ""],
    [`• Имя: ${clientName}`, ""],
    [`• Телефон: ${clientPhone || clientData.phone || "Не указан"}`, ""],
    [`• Email: ${clientEmail}`, ""],
    ["", ""],
    ["📞 НАШИ КОНТАКТЫ:", ""],
    ["• Email: yaradio@bk.ru", ""],
    ["• Telegram: @YaRadioBot", ""],
    ["• Телефон: 8 (34535) 5-01-51", ""],
    ["", ""],
    ["🎯 СТАРТ КАМПАНИИ:", ""],
    ["В течение 24 часов после подтверждения", ""],
    ["", ""],
    [`📅 Дата формирования: ${dateStr} ${timeStr}`, ""],
  ];

  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
  summarySheet["!cols"] = [{ wch: 50 }, { wch: 15 }];
  XLSX.utils.book_append_sheet(wb, summarySheet, "Расчёт");

  const excelBuffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
  return new Uint8Array(excelBuffer);
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: MediaPlanRequest = await req.json();
    const { type, clientEmail, clientName, clientPhone, clientData, mediaPlan, originalQuery } = data;

    if (!clientEmail || !clientName) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    const results = { clientEmailSent: false, adminEmailSent: false };
    const planId = generatePlanId();

    // Handle calculator request
    if (type === "calculator_request" && clientData) {
      // Generate Excel
      const excelBuffer = generateCalculatorExcel(clientData, clientName, clientEmail, clientPhone, planId);
      const excelBase64 = btoa(String.fromCharCode(...excelBuffer));

      const calculatorClientHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #C8208E;">Спасибо за заявку! #${planId}</h1>
          
          <p>Здравствуйте, ${clientName}!</p>
          <p>Мы получили вашу заявку на расчёт рекламной кампании. Наш менеджер свяжется с вами в ближайшее время.</p>
          
          <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p style="margin: 0; font-size: 16px;">🎁 <strong>Ролик в подарок!</strong> Производство рекламного ролика бесплатно.</p>
          </div>
          
          <p style="margin: 15px 0;"><strong>📎 Ваш расчёт во вложении (Excel-файл)</strong></p>
          
          <h2 style="color: #333;">📊 Краткие показатели:</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="background: #C8208E; color: white;">
              <td style="padding: 10px;">Параметр</td>
              <td style="padding: 10px;">Значение</td>
            </tr>
            <tr style="border-bottom: 1px solid #ddd;">
              <td style="padding: 10px;">Радиостанции</td>
              <td style="padding: 10px;">${clientData.stationsCount} шт.</td>
            </tr>
            <tr style="border-bottom: 1px solid #ddd;">
              <td style="padding: 10px;">Срок размещения</td>
              <td style="padding: 10px;">${clientData.days} дней</td>
            </tr>
            <tr style="border-bottom: 1px solid #ddd;">
              <td style="padding: 10px;">Охват аудитории</td>
              <td style="padding: 10px;">~${clientData.totalReach?.toLocaleString()} чел.</td>
            </tr>
            <tr style="border-bottom: 1px solid #ddd; background: #f5f5f5;">
              <td style="padding: 10px;"><strong>Стоимость кампании</strong></td>
              <td style="padding: 10px; font-weight: bold; color: #C8208E; font-size: 18px;">${clientData.finalPrice?.toLocaleString()} ₽</td>
            </tr>
          </table>
          
          <div style="margin-top: 30px; padding: 20px; background: #f0f9ff; border-radius: 8px;">
            <p style="margin: 0;"><strong>Свяжитесь с нами:</strong></p>
            <p style="margin: 5px 0;">📞 8 (34535) 5-01-51</p>
            <p style="margin: 5px 0;">📧 yaradio@bk.ru</p>
            <p style="margin: 5px 0;">💬 <a href="https://t.me/YaRadioBot">Telegram</a></p>
          </div>
        </div>
      `;

      const calculatorAdminHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto;">
          <h1 style="color: #C8208E;">🧮 Новая заявка из калькулятора! #${planId}</h1>
          
          <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
            <h2 style="margin-top: 0; color: #856404;">📋 Данные клиента:</h2>
            <table style="width: 100%;">
              <tr><td style="padding: 5px 0;"><strong>Имя:</strong></td><td>${clientName}</td></tr>
              <tr><td style="padding: 5px 0;"><strong>Email:</strong></td><td><a href="mailto:${clientEmail}">${clientEmail}</a></td></tr>
              <tr><td style="padding: 5px 0;"><strong>Телефон:</strong></td><td>${clientData.phone || clientPhone || 'Не указан'}</td></tr>
            </table>
          </div>
          
          <p><strong>📎 Полный расчёт во вложении (Excel-файл)</strong></p>
          
          <h2>📊 Параметры расчёта:</h2>
          <table style="width: 100%; border-collapse: collapse; margin: 10px 0;">
            <tr style="background: #4CAF50; color: white;">
              <th style="padding: 10px; text-align: left;">Параметр</th>
              <th style="padding: 10px; text-align: right;">Значение</th>
            </tr>
            <tr style="border-bottom: 1px solid #ddd;">
              <td style="padding: 10px;">Радиостанции</td>
              <td style="padding: 10px; text-align: right;">${clientData.stations}</td>
            </tr>
            <tr style="border-bottom: 1px solid #ddd;">
              <td style="padding: 10px;">Срок размещения</td>
              <td style="padding: 10px; text-align: right;">${clientData.days} дней</td>
            </tr>
            <tr style="border-bottom: 1px solid #ddd;">
              <td style="padding: 10px;">Всего выходов</td>
              <td style="padding: 10px; text-align: right;">${clientData.totalSpots}</td>
            </tr>
            <tr style="border-bottom: 1px solid #ddd; background: #e8f5e9;">
              <td style="padding: 10px;"><strong>Стоимость кампании</strong></td>
              <td style="padding: 10px; text-align: right; font-weight: bold; color: #C8208E; font-size: 18px;">${clientData.finalPrice?.toLocaleString()} ₽</td>
            </tr>
          </table>

          <div style="margin-top: 30px; padding: 15px; background: #ffebee; border-radius: 8px; text-align: center;">
            <p style="margin: 0; font-size: 14px;">⏰ Заявка получена: ${new Date().toLocaleString('ru-RU', { timeZone: 'Asia/Yekaterinburg' })} (Екатеринбург)</p>
          </div>
        </div>
      `;

      if (RESEND_API_KEY) {
        // Send to client with Excel attachment
        try {
          const clientResponse = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${RESEND_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              from: "РТО <onboarding@resend.dev>",
              to: [clientEmail],
              subject: `Ваш расчёт рекламной кампании #${planId} от РТО`,
              html: calculatorClientHtml,
              attachments: [
                {
                  filename: `mediaplan_${planId}.xlsx`,
                  content: excelBase64,
                }
              ],
            }),
          });
          results.clientEmailSent = clientResponse.ok;
          if (!clientResponse.ok) {
            const errorText = await clientResponse.text();
            console.error("Resend client error:", errorText);
          }
        } catch (e) {
          console.error("Failed to send client email:", e);
        }

        // Send to admin with Excel attachment
        try {
          const adminResponse = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${RESEND_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              from: "РТО Сайт <onboarding@resend.dev>",
              to: [ADMIN_EMAIL],
              subject: `🧮 Калькулятор #${planId}: ${clientName} | ${clientData.finalPrice?.toLocaleString()} ₽`,
              html: calculatorAdminHtml,
              attachments: [
                {
                  filename: `mediaplan_${planId}.xlsx`,
                  content: excelBase64,
                }
              ],
            }),
          });
          results.adminEmailSent = adminResponse.ok;
          if (!adminResponse.ok) {
            const errorText = await adminResponse.text();
            console.error("Resend admin error:", errorText);
          }
        } catch (e) {
          console.error("Failed to send admin email:", e);
        }
      }

      return new Response(
        JSON.stringify({ success: true, emailResults: results, planId }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Handle media plan request
    if (!mediaPlan) {
      return new Response(
        JSON.stringify({ error: "Missing media plan data" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Generate Excel for media plan
    const excelBuffer = generateMediaPlanExcel(mediaPlan, clientName, clientEmail, clientPhone, originalQuery, planId);
    const excelBase64 = btoa(String.fromCharCode(...excelBuffer));
    
    // Generate HTML for media plan (for client)
    const mediaPlanHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #C8208E;">Ваш медиаплан от РТО #${planId}</h1>
        
        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
          <p style="margin: 0; font-size: 16px;">🎁 <strong>Ролик в подарок!</strong> Производство рекламного ролика бесплатно.</p>
        </div>
        
        <p style="margin: 15px 0;"><strong>📎 Полный медиаплан во вложении (Excel-файл)</strong></p>
        
        <h2 style="color: #333;">📊 Стратегия: ${mediaPlan.strategy.title}</h2>
        <p>${mediaPlan.strategy.description}</p>
        
        <h2 style="color: #333;">📻 Рекомендованные станции</h2>
        <ul>
          ${mediaPlan.recommendedStations.map(s => `
            <li><strong>${s.name}</strong> (${s.freq} FM) - ${s.reason}</li>
          `).join('')}
        </ul>
        
        <h2 style="color: #333;">💰 Предварительный расчёт</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr style="background: #C8208E; color: white;">
            <td style="padding: 10px;">Параметр</td>
            <td style="padding: 10px;">Значение</td>
          </tr>
          <tr style="border-bottom: 1px solid #ddd;">
            <td style="padding: 10px;">Количество станций</td>
            <td style="padding: 10px;">${mediaPlan.calculation.stations_count}</td>
          </tr>
          <tr style="border-bottom: 1px solid #ddd;">
            <td style="padding: 10px;">Дней размещения</td>
            <td style="padding: 10px;">${mediaPlan.calculation.campaign_days}</td>
          </tr>
          <tr style="border-bottom: 1px solid #ddd;">
            <td style="padding: 10px;">Всего выходов</td>
            <td style="padding: 10px;">${mediaPlan.calculation.total_spots}</td>
          </tr>
          <tr style="border-bottom: 1px solid #ddd;">
            <td style="padding: 10px;">Охват аудитории</td>
            <td style="padding: 10px;">~${mediaPlan.calculation.estimated_reach.toLocaleString()} чел.</td>
          </tr>
          <tr style="border-bottom: 1px solid #ddd;">
            <td style="padding: 10px;">Стоимость кампании</td>
            <td style="padding: 10px; font-weight: bold; color: #C8208E;">${mediaPlan.calculation.estimated_cost.toLocaleString()} ₽</td>
          </tr>
          <tr style="border-bottom: 1px solid #ddd;">
            <td style="padding: 10px;">Производство ролика</td>
            <td style="padding: 10px; font-weight: bold; color: #4CAF50;">Бесплатно (подарок)</td>
          </tr>
          <tr>
            <td style="padding: 10px;">Стоимость контакта</td>
            <td style="padding: 10px;">${mediaPlan.calculation.cost_per_contact.toFixed(2)} ₽</td>
          </tr>
        </table>
        
        <div style="margin-top: 30px; padding: 20px; background: #f0f9ff; border-radius: 8px;">
          <p style="margin: 0;"><strong>Для оформления заявки свяжитесь с нами:</strong></p>
          <p style="margin: 5px 0;">📞 8 (34535) 5-01-51</p>
          <p style="margin: 5px 0;">📧 yaradio@bk.ru</p>
          <p style="margin: 5px 0;">💬 <a href="https://t.me/YaRadioBot">Telegram</a></p>
        </div>
      </div>
    `;

    // Admin notification HTML
    const adminHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto;">
        <h1 style="color: #C8208E;">🔔 Новая заявка с сайта! #${planId}</h1>
        
        <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
          <h2 style="margin-top: 0; color: #856404;">📋 Данные клиента:</h2>
          <table style="width: 100%;">
            <tr><td style="padding: 5px 0;"><strong>Имя:</strong></td><td>${clientName}</td></tr>
            <tr><td style="padding: 5px 0;"><strong>Email:</strong></td><td><a href="mailto:${clientEmail}">${clientEmail}</a></td></tr>
            ${clientPhone ? `<tr><td style="padding: 5px 0;"><strong>Телефон:</strong></td><td><a href="tel:${clientPhone}">${clientPhone}</a></td></tr>` : ''}
          </table>
        </div>
        
        <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2196F3;">
          <h2 style="margin-top: 0; color: #1565c0;">💬 Запрос клиента:</h2>
          <p style="font-style: italic; font-size: 16px;">"${originalQuery}"</p>
        </div>
        
        <p><strong>📎 Полный медиаплан во вложении (Excel-файл)</strong></p>
        
        <h2>📊 Стратегия: ${mediaPlan.strategy.title}</h2>
        <p>${mediaPlan.strategy.description}</p>

        <h2>📻 Рекомендованные станции:</h2>
        <ul>
          ${mediaPlan.recommendedStations.map(s => `<li><strong>${s.name}</strong> (${s.freq} FM)</li>`).join('')}
        </ul>
        
        <h2>💰 Финансовый расчёт:</h2>
        <table style="width: 100%; border-collapse: collapse; margin: 10px 0;">
          <tr style="background: #4CAF50; color: white;">
            <th style="padding: 10px; text-align: left;">Параметр</th>
            <th style="padding: 10px; text-align: right;">Значение</th>
          </tr>
          <tr style="border-bottom: 1px solid #ddd;">
            <td style="padding: 10px;">Дней размещения</td>
            <td style="padding: 10px; text-align: right;">${mediaPlan.calculation.campaign_days}</td>
          </tr>
          <tr style="border-bottom: 1px solid #ddd;">
            <td style="padding: 10px;">Всего выходов</td>
            <td style="padding: 10px; text-align: right;">${mediaPlan.calculation.total_spots}</td>
          </tr>
          <tr style="border-bottom: 1px solid #ddd; background: #e8f5e9;">
            <td style="padding: 10px;"><strong>Стоимость кампании</strong></td>
            <td style="padding: 10px; text-align: right; font-weight: bold; color: #C8208E; font-size: 18px;">${mediaPlan.calculation.estimated_cost.toLocaleString()} ₽</td>
          </tr>
        </table>

        <div style="margin-top: 30px; padding: 15px; background: #ffebee; border-radius: 8px; text-align: center;">
          <p style="margin: 0; font-size: 14px;">⏰ Заявка получена: ${new Date().toLocaleString('ru-RU', { timeZone: 'Asia/Yekaterinburg' })} (Екатеринбург)</p>
        </div>
      </div>
    `;

    const mediaPlanResults = { clientEmailSent: false, adminEmailSent: false };

    if (RESEND_API_KEY) {
      // Send to client with Excel attachment
      try {
        const clientResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "РТО <onboarding@resend.dev>",
            to: [clientEmail],
            subject: `Ваш медиаплан #${planId} от РТО готов!`,
            html: mediaPlanHtml,
            attachments: [
              {
                filename: `mediaplan_${planId}.xlsx`,
                content: excelBase64,
              }
            ],
          }),
        });
        mediaPlanResults.clientEmailSent = clientResponse.ok;
        if (!clientResponse.ok) {
          const errorText = await clientResponse.text();
          console.error("Resend client error:", errorText);
        }
      } catch (e) {
        console.error("Failed to send client email:", e);
      }

      // Send FULL COPY to admin with Excel attachment
      try {
        const adminResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "РТО Сайт <onboarding@resend.dev>",
            to: [ADMIN_EMAIL],
            subject: `🔔 Медиаплан #${planId}: ${clientName} | ${mediaPlan.calculation.estimated_cost.toLocaleString()} ₽`,
            html: adminHtml,
            attachments: [
              {
                filename: `mediaplan_${planId}.xlsx`,
                content: excelBase64,
              }
            ],
          }),
        });
        mediaPlanResults.adminEmailSent = adminResponse.ok;
        if (!adminResponse.ok) {
          const errorText = await adminResponse.text();
          console.error("Resend admin error:", errorText);
        }
      } catch (e) {
        console.error("Failed to send admin email:", e);
      }
    } else {
      console.log("RESEND_API_KEY not configured, skipping emails");
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Медиаплан сохранён",
        emailResults: mediaPlanResults,
        planId
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Send media plan error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
