import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface MediaPlanRequest {
  clientEmail: string;
  clientName: string;
  clientPhone?: string;
  mediaPlan: {
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
  originalQuery: string;
}

const ADMIN_EMAIL = "a.khlistunov@gmail.com";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { clientEmail, clientName, clientPhone, mediaPlan, originalQuery }: MediaPlanRequest = await req.json();

    if (!clientEmail || !clientName || !mediaPlan) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    
    // Generate HTML for media plan (for client)
    const mediaPlanHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #C8208E;">Ваш медиаплан от РТО</h1>
        
        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
          <p style="margin: 0; font-size: 16px;">🎁 <strong>Ролик в подарок!</strong> Производство рекламного ролика бесплатно.</p>
        </div>
        
        <h2 style="color: #333;">📊 Стратегия: ${mediaPlan.strategy.title}</h2>
        <p>${mediaPlan.strategy.description}</p>
        
        <h2 style="color: #333;">📻 Рекомендованные станции</h2>
        <ul>
          ${mediaPlan.recommendedStations.map(s => `
            <li><strong>${s.name}</strong> (${s.freq} FM) - ${s.reason}</li>
          `).join('')}
        </ul>
        
        <h2 style="color: #333;">💡 Креативные рекомендации</h2>
        <ul>
          ${mediaPlan.creative.tips.map(tip => `<li>${tip}</li>`).join('')}
        </ul>
        
        <h2 style="color: #333;">🎙️ Варианты текстов роликов</h2>
        ${mediaPlan.scripts.map((script, i) => `
          <div style="background: #f5f5f5; padding: 15px; margin: 10px 0; border-radius: 8px;">
            <h3>Вариант ${i + 1}: ${script.title} (${script.duration} сек)</h3>
            <p style="font-style: italic;">"${script.text}"</p>
          </div>
        `).join('')}
        
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
            <td style="padding: 10px;">Выходов в день</td>
            <td style="padding: 10px;">${mediaPlan.calculation.spots_per_day}</td>
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

    // Admin notification HTML - FULL COPY of all data
    const adminHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto;">
        <h1 style="color: #C8208E;">🔔 Новая заявка с сайта!</h1>
        
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
        
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="margin-top: 0;">📊 Стратегия: ${mediaPlan.strategy.title}</h2>
          <p>${mediaPlan.strategy.description}</p>
        </div>

        <h2>📻 Рекомендованные станции:</h2>
        <table style="width: 100%; border-collapse: collapse; margin: 10px 0;">
          <tr style="background: #C8208E; color: white;">
            <th style="padding: 10px; text-align: left;">Станция</th>
            <th style="padding: 10px; text-align: left;">Частота</th>
            <th style="padding: 10px; text-align: left;">Причина</th>
          </tr>
          ${mediaPlan.recommendedStations.map(s => `
            <tr style="border-bottom: 1px solid #ddd;">
              <td style="padding: 10px;"><strong>${s.name}</strong></td>
              <td style="padding: 10px;">${s.freq} FM</td>
              <td style="padding: 10px;">${s.reason}</td>
            </tr>
          `).join('')}
        </table>

        <h2>💡 Креативные рекомендации:</h2>
        <ul>
          ${mediaPlan.creative.tips.map(tip => `<li>${tip}</li>`).join('')}
        </ul>
        <p><strong>Крючки:</strong> ${mediaPlan.creative.hooks.join(', ')}</p>

        <h2>🎙️ Тексты роликов:</h2>
        ${mediaPlan.scripts.map((script, i) => `
          <div style="background: #f9f9f9; padding: 15px; margin: 10px 0; border-radius: 8px; border-left: 3px solid #C8208E;">
            <h3 style="margin-top: 0;">Вариант ${i + 1}: ${script.title} (${script.duration} сек)</h3>
            <p style="font-style: italic;">"${script.text}"</p>
          </div>
        `).join('')}
        
        <h2>💰 Финансовый расчёт:</h2>
        <table style="width: 100%; border-collapse: collapse; margin: 10px 0;">
          <tr style="background: #4CAF50; color: white;">
            <th style="padding: 10px; text-align: left;">Параметр</th>
            <th style="padding: 10px; text-align: right;">Значение</th>
          </tr>
          <tr style="border-bottom: 1px solid #ddd;">
            <td style="padding: 10px;">Количество станций</td>
            <td style="padding: 10px; text-align: right;">${mediaPlan.calculation.stations_count}</td>
          </tr>
          <tr style="border-bottom: 1px solid #ddd;">
            <td style="padding: 10px;">Выходов в день</td>
            <td style="padding: 10px; text-align: right;">${mediaPlan.calculation.spots_per_day}</td>
          </tr>
          <tr style="border-bottom: 1px solid #ddd;">
            <td style="padding: 10px;">Дней размещения</td>
            <td style="padding: 10px; text-align: right;">${mediaPlan.calculation.campaign_days}</td>
          </tr>
          <tr style="border-bottom: 1px solid #ddd;">
            <td style="padding: 10px;">Всего выходов</td>
            <td style="padding: 10px; text-align: right;">${mediaPlan.calculation.total_spots}</td>
          </tr>
          <tr style="border-bottom: 1px solid #ddd;">
            <td style="padding: 10px;">Охват аудитории</td>
            <td style="padding: 10px; text-align: right;">~${mediaPlan.calculation.estimated_reach.toLocaleString()} чел.</td>
          </tr>
          <tr style="border-bottom: 1px solid #ddd; background: #e8f5e9;">
            <td style="padding: 10px;"><strong>Стоимость кампании</strong></td>
            <td style="padding: 10px; text-align: right; font-weight: bold; color: #C8208E; font-size: 18px;">${mediaPlan.calculation.estimated_cost.toLocaleString()} ₽</td>
          </tr>
          <tr style="border-bottom: 1px solid #ddd;">
            <td style="padding: 10px;">Производство ролика</td>
            <td style="padding: 10px; text-align: right; color: #4CAF50;"><strong>Бесплатно</strong></td>
          </tr>
          <tr>
            <td style="padding: 10px;">Стоимость контакта</td>
            <td style="padding: 10px; text-align: right;">${mediaPlan.calculation.cost_per_contact.toFixed(2)} ₽</td>
          </tr>
        </table>

        <div style="margin-top: 30px; padding: 15px; background: #ffebee; border-radius: 8px; text-align: center;">
          <p style="margin: 0; font-size: 14px;">⏰ Заявка получена: ${new Date().toLocaleString('ru-RU', { timeZone: 'Asia/Yekaterinburg' })} (Екатеринбург)</p>
        </div>
      </div>
    `;

    const results = { clientEmailSent: false, adminEmailSent: false };

    if (RESEND_API_KEY) {
      // Send to client
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
            subject: "Ваш медиаплан от РТО готов!",
            html: mediaPlanHtml,
          }),
        });
        results.clientEmailSent = clientResponse.ok;
      } catch (e) {
        console.error("Failed to send client email:", e);
      }

      // Send FULL COPY to admin
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
            subject: `🔔 Новая заявка: ${clientName} | ${mediaPlan.calculation.estimated_cost.toLocaleString()} ₽`,
            html: adminHtml,
          }),
        });
        results.adminEmailSent = adminResponse.ok;
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
        emailResults: results 
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
